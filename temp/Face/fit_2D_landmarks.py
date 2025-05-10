import os
import cv2
import sys
import argparse
import numpy as np
import tensorflow as tf
from psbody.mesh import Mesh
from psbody.mesh.meshviewer import MeshViewers
from utils.landmarks import load_embedding, tf_get_model_lmks, create_lmk_spheres, tf_project_points
from utils.project_on_mesh import compute_texture_map
from tf_smpl.batch_smpl import SMPL
from tensorflow.contrib.opt import ScipyOptimizerInterface as scipy_pt

def str2bool(val):
    if isinstance(val, bool):
        return val
    elif isinstance(val, str):
        if val.lower() in ['true', 't', 'yes', 'y']:
            return True
        elif val.lower() in ['false', 'f', 'no', 'n']:
            return False
    return False

class LandmarkFitting:
    def __init__(self, model_fname):
        self.model_fname = model_fname
        self.last_tf_trans = tf.Variable(np.zeros((1, 3)), dtype=tf.float64, trainable=True)
        self.last_tf_rot = tf.Variable(np.zeros((1, 3)), dtype=tf.float64, trainable=True)
        self.last_tf_pose = tf.Variable(np.zeros((1, 12)), dtype=tf.float64, trainable=True)
        self.last_tf_shape = tf.Variable(np.zeros((1, 300)), dtype=tf.float64, trainable=True)
        self.last_tf_exp = tf.Variable(np.zeros((1, 100)), dtype=tf.float64, trainable=True)

    def fit_lmk2d(self, frame_idx, target_img, target_2d_lmks, model_fname, lmk_face_idx, lmk_b_coords, weights, visualize):
        if frame_idx >= 0:
            tf_trans = tf.Variable(np.zeros((1, 3)), dtype=tf.float64, trainable=True)
            tf_rot = tf.Variable(np.zeros((1, 3)), dtype=tf.float64, trainable=True)
            tf_pose = tf.Variable(np.zeros((1, 12)), dtype=tf.float64, trainable=True)
            tf_shape = tf.Variable(np.zeros((1, 300)), dtype=tf.float64, trainable=True)
            tf_exp = tf.Variable(np.zeros((1, 100)), dtype=tf.float64, trainable=True)
        else:
            tf_trans = self.last_tf_trans
            tf_rot = self.last_tf_rot
            tf_pose = self.last_tf_pose
            tf_shape = self.last_tf_shape
            tf_exp = self.last_tf_exp

        smpl = SMPL(model_fname)
        tf_model = tf.squeeze(smpl(tf_trans,
                                   tf.concat((tf_shape, tf_exp), axis=-1),
                                   tf.concat((tf_rot, tf_pose), axis=-1)))

        with tf.Session() as session:
            session.run(tf.global_variables_initializer())
            self.last_tf_trans = tf_trans
            self.last_tf_rot = tf_rot
            self.last_tf_pose = tf_pose
            self.last_tf_shape = tf_shape
            self.last_tf_exp = tf_exp


            target_2d_lmks[:, 1] = target_img.shape[0] - target_2d_lmks[:, 1]
            lmks_3d = tf_get_model_lmks(tf_model, smpl.f, lmk_face_idx, lmk_b_coords)

            s2d = np.mean(np.linalg.norm(target_2d_lmks - np.mean(target_2d_lmks, axis=0), axis=1))
            s3d = tf.reduce_mean(tf.sqrt(tf.reduce_sum(tf.square(lmks_3d - tf.reduce_mean(lmks_3d, axis=0))[:, :2], axis=1)))
            tf_scale = tf.Variable(s2d / s3d, dtype=lmks_3d.dtype)

            lmks_proj_2d = tf_project_points(lmks_3d, tf_scale, np.zeros(2))
            factor = max(np.ptp(target_2d_lmks[:, 0]), np.ptp(target_2d_lmks[:, 1]))
            lmk_dist = weights['lmk'] * tf.reduce_sum(tf.square(lmks_proj_2d - target_2d_lmks)) / (factor ** 2)
            neck_pose_reg = weights['neck_pose'] * tf.reduce_sum(tf.square(tf_pose[:, :3]))
            jaw_pose_reg = weights['jaw_pose'] * tf.reduce_sum(tf.square(tf_pose[:, 3:6]))
            eyeballs_pose_reg = weights['eyeballs_pose'] * tf.reduce_sum(tf.square(tf_pose[:, 6:]))
            shape_reg = weights['shape'] * tf.reduce_sum(tf.square(tf_shape))
            exp_reg = weights['expr'] * tf.reduce_sum(tf.square(tf_exp))

            session.run(tf.global_variables_initializer())

            def on_step(*args):
                pass  # Add visualization if needed

            print('Optimize rigid transformation')
            vars = [tf_scale, tf_trans, tf_rot]
            loss = lmk_dist
            optimizer = scipy_pt(loss=loss, var_list=vars, method='L-BFGS-B', options={'disp': 1, 'ftol': 5e-6})
            optimizer.minimize(session)

            print('Optimize model parameters')
            vars = [tf_scale, tf_trans[:2], tf_rot, tf_pose, tf_shape, tf_exp]
            loss = lmk_dist + shape_reg + exp_reg + neck_pose_reg + jaw_pose_reg + eyeballs_pose_reg
            optimizer = scipy_pt(loss=loss, var_list=vars, method='L-BFGS-B', options={'disp': 0, 'ftol': 1e-7})
            optimizer.minimize(session)

            print('Fitting done')
            np_verts, np_scale = session.run([tf_model, tf_scale])
            return Mesh(np_verts, smpl.f), np_scale

def run_2d_lmk_fitting(model_fname, flame_lmk_path, texture_mapping, target_img_dir, target_lmk_path, out_path, visualize):
    if 'generic' not in model_fname:
        print('You are fitting a gender-specific model. Ensure you selected the correct model.')
    if not os.path.exists(flame_lmk_path):
        print(f'FLAME landmark embedding not found - {flame_lmk_path}')
        return
    if not os.path.exists(target_img_dir):
        print(f'Target image directory not found - {target_img_dir}')
        return
    if not os.path.exists(target_lmk_path):
        print(f'Landmarks of target image not found - {target_lmk_path}')
        return
    if not os.path.exists(out_path):
        os.makedirs(out_path)

    lmk_face_idx, lmk_b_coords = load_embedding(flame_lmk_path)
    all_landmarks = np.load(target_lmk_path)
    num_frames = all_landmarks.shape[0]

    print(f"Processing {num_frames} frames...")

    weights = {
        'lmk': 1.0,
        'shape': 1e-3,
        'expr': 1e-3,
        'neck_pose': 100.0,
        'jaw_pose': 1e-3,
        'eyeballs_pose': 10.0,
    }

    fitting_instance = LandmarkFitting(model_fname)

    for frame_idx in range(num_frames):
        
        
        frame_landmarks = all_landmarks[frame_idx]
        print(f"Processing frame {frame_idx + 1}/{num_frames}")

        # Load the image for this frame
        frame_str = f"{frame_idx:03d}"
        frame_img_path = os.path.join(target_img_dir, f"face_{frame_str}.png")

        print( frame_img_path)
        if not os.path.exists(frame_img_path):
            print(f"Frame image not found: {frame_img_path}")
            continue
        target_img = cv2.imread(frame_img_path)

        result_mesh, result_scale = fitting_instance.fit_lmk2d(
            frame_idx, target_img, frame_landmarks, model_fname,
            lmk_face_idx, lmk_b_coords, weights, visualize
        )

        if sys.version_info >= (3, 0):
            texture_data = np.load(texture_mapping, allow_pickle=True, encoding='latin1').item()
        else:
            texture_data = np.load(texture_mapping, allow_pickle=True).item()

        texture_map = compute_texture_map(target_img, result_mesh, result_scale, texture_data)

        out_mesh_fname = os.path.join(out_path, f'frame_{frame_str}.obj')
        out_img_fname = os.path.join(out_path, f'frame_{frame_str}.png')

        cv2.imwrite(out_img_fname, texture_map)
        result_mesh.set_vertex_colors('white')
        result_mesh.vt = texture_data['vt']
        result_mesh.ft = texture_data['ft']
        result_mesh.set_texture_image(out_img_fname)
        result_mesh.write_obj(out_mesh_fname)
        np.save(os.path.join(out_path, f'frame_{frame_str}_scale.npy'), result_scale)
        print(result_mesh.v.shape)
        print(f"Saved: {out_mesh_fname}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Build texture from image')
    parser.add_argument('--model_fname', default='./models/generic_model.pkl', help='Path of the FLAME model')
    parser.add_argument('--flame_lmk_path', default='./data/flame_static_embedding.pkl', help='Path of the landmark embedding')
    parser.add_argument('--texture_mapping', default='./data/texture_data.npy', help='Pre-computed FLAME texture mapping')
    parser.add_argument('--target_img_path', default='./faces', help='Path to directory of image frames (e.g., face_000.png, face_001.png, ...)')
    parser.add_argument('--target_lmk_path', default='./data/imgHQ00088_lmks.npy', help='Path to 2D landmark file')
    parser.add_argument('--out_path', default='./results', help='Path for output results')
    parser.add_argument('--visualize', default='True', help='Visualize fitting progress')
    args = parser.parse_args()

    run_2d_lmk_fitting(args.model_fname, args.flame_lmk_path, args.texture_mapping, args.target_img_path, args.target_lmk_path, args.out_path, str2bool(args.visualize))