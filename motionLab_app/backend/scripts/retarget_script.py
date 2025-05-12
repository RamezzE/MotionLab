import bpy
import math
import os
import sys

def setup_addon(addon_zip_path: str) -> None:
    """Install and enable the retarget_bvh addon."""
    bpy.ops.preferences.addon_install(filepath=addon_zip_path, overwrite=True)
    bpy.ops.preferences.addon_enable(module="retarget_bvh")
    bpy.ops.wm.save_userpref()
    print("retarget_bvh" in bpy.context.preferences.addons)

def clear_scene() -> None:
    """Clear all objects from the scene."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def import_models(bvh_path: str, avatar_path: str) -> tuple:
    """Import BVH and GLB models and return their objects."""
    bvh_name = os.path.splitext(os.path.basename(bvh_path))[0]
    
    bpy.ops.import_anim.bvh(
        filepath=bvh_path,
        update_scene_fps=True,
        update_scene_duration=True
    )
    bpy.ops.import_scene.gltf(filepath=avatar_path)

    glb_obj = bpy.data.objects.get("Armature")
    bvh_obj = bpy.data.objects.get(bvh_name)

    if not glb_obj or not bvh_obj:
        raise RuntimeError("Armature not found. Check BVH and avatar files.")
    
    return glb_obj, bvh_obj

def setup_bvh(bvh_obj, glb_obj) -> None:
    """Configure BVH object's scale, position, and rotation."""
    bvh_obj.scale = (0.00819, 0.00819, 0.00819)
    # Keep original BVH position
    bvh_obj.rotation_mode = 'XYZ'
    bvh_obj.rotation_euler = (math.radians(270), math.radians(0), math.radians(0))

    bpy.context.view_layer.objects.active = bvh_obj
    bpy.ops.object.select_all(action='DESELECT')
    bvh_obj.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)

def setup_glb(glb_obj, bvh_obj) -> None:
    """Configure GLB object's position and rotation to match BVH."""
    # Match GLB position with BVH
    glb_obj.location = bvh_obj.location
    glb_obj.rotation_mode = 'XYZ'
    glb_obj.rotation_euler = (math.radians(0), math.radians(0), math.radians(0))

def perform_retargeting(bvh_obj, glb_obj) -> None:
    """Perform the retargeting operation between BVH and GLB."""
    bpy.ops.object.select_all(action='DESELECT')
    bvh_obj.select_set(True)
    bpy.context.view_layer.objects.active = glb_obj

    result = bpy.ops.mcp.retarget_selected_to_active('EXEC_DEFAULT')
    print("Retargeting result:", result)

def adjust_glb_orientation(glb_obj) -> None:
    """Adjust the GLB object's orientation after retargeting."""
    bpy.ops.object.select_all(action='DESELECT')
    glb_obj.select_set(True)
    bpy.context.view_layer.objects.active = glb_obj
    glb_obj.rotation_mode = 'XYZ'
    glb_obj.rotation_euler = (math.radians(90), math.radians(0), math.radians(0))
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)

def set_geomtery_to_origin(glb_obj):
    bpy.ops.object.select_all(action='DESELECT')
    glb_obj.select_set(True)
    bpy.context.view_layer.objects.active = glb_obj
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='MEDIAN')

def export_retargeted_model(glb_obj, export_path: str) -> None:
    """Export the retargeted model to GLB format."""
    for child in glb_obj.children:
        child.select_set(True)

    os.makedirs(os.path.dirname(export_path), exist_ok=True)

    bpy.ops.export_scene.gltf(
        filepath=export_path,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_animations=True
    )
    print(f"Exported to {export_path}")

def retarget_bvh_to_avatar(bvh_path: str, avatar_path: str, export_path: str, addon_zip_path: str = "./utils/retarget_bvh-4.2.1.zip") -> str:
    """Main function to retarget BVH animation to GLB avatar."""
    setup_addon(addon_zip_path)
    clear_scene()
    
    glb_obj, bvh_obj = import_models(bvh_path, avatar_path)
    setup_bvh(bvh_obj, glb_obj)
    setup_glb(glb_obj, bvh_obj)
    perform_retargeting(bvh_obj, glb_obj)
    set_geomtery_to_origin(glb_obj)
    adjust_glb_orientation(glb_obj)
    export_retargeted_model(glb_obj, export_path)
    
    return export_path

# Entry point
if __name__ == "__main__":
    args = sys.argv
    args = args[args.index("--") + 1:]  # Get args after '--'

    if len(args) != 3:
        print("Usage:")
        print(" python retarget_script.py -- input.bvh input.glb output.glb")
        sys.exit(1)

    bvh_path, avatar_path, export_path = args
    retarget_bvh_to_avatar(bvh_path, avatar_path, export_path)
