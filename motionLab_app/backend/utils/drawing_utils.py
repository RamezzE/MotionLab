import cv2
import numpy as np
import matplotlib.pyplot as plt

class DrawingUtils:
    OPENPOSE_CONNECTIONS_25 = [
        (0, 1),  
        (0, 15),
        (0, 16),
        (1, 2), 
        (1,5),
        (1, 8),
        (2, 3),
        (3, 4),
        (5, 6), 
        (6, 7),
        (8, 9),
        (8, 12),
        (9, 10),
        (10, 11),
        (11, 22),
        (11, 24),
        (12, 13),
        (13, 14),
        (14, 19),
        (14, 21),
        (15, 17),
        (16, 18),
        (19, 20),
        (22, 23),    
    ]
    CMU_CONNECTIONS = [
        (0, 1), (0, 4), (1, 2), (4, 5), (2, 3), (5, 6), (0, 7), (7, 8), (8, 9), (9, 10), (8, 11), (11, 12), (12, 13), 
        (8, 14), (14, 15), (15, 16),
    ]
    
    @staticmethod
    def draw_openpose_keypoints(frame, keypoints):
        for i, (x, y, _) in enumerate(keypoints):
            cv2.circle(frame, (int(x), int(y)), 5, (0, 255, 0), -1)
            cv2.putText(frame, str(i), (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
        
        for connection in DrawingUtils.OPENPOSE_CONNECTIONS_25:
            joint1 = keypoints[connection[0]]
            joint2 = keypoints[connection[1]] 
            cv2.line(frame, (int(joint1[0]), int(joint1[1])), (int(joint2[0]), int(joint2[1])), (0, 255, 0), 2)
        
        return frame
    
    @staticmethod
    def visualize_3D_points(points_3d, connections=None):
        fig = plt.figure()
        ax = fig.add_subplot(111, projection='3d')        
        points_3d_numpy = np.array(points_3d)
        x_max, y_max, z_max = np.max(points_3d_numpy[:, :, 0]), np.max(points_3d_numpy[:, :, 1]), np.max(points_3d_numpy[:, :, 2])

        up_limit = max(abs(x_max), abs(y_max), abs(z_max))
        down_limit = -up_limit

        for point in points_3d:
            ax.clear()
            x = point[:, 0]  # Extract X coordinates
            y = point[:, 1]  # Extract Y coordinates
            z = point[:, 2]  # Extract Z coordinates

            ax.scatter(x, -z, -y)

            for connection in connections:
                idx1, idx2 = connection
                ax.plot([x[idx1], x[idx2]], [-z[idx1], -z[idx2]], [-y[idx1], -y[idx2]], color='black')

            ax.set_xlim(down_limit, up_limit)
            ax.set_ylim(down_limit, up_limit)
            ax.set_zlim(down_limit, up_limit)

            ax.set_xlabel('X-axis')
            ax.set_ylabel('Y-axis')
            ax.set_zlabel('Z-axis')

            plt.pause(0.01)
            plt.show(block=False)