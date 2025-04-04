from flask import Blueprint, request, jsonify
from controllers.admin_controller import AdminController

# Create a Blueprint for admin routes
admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/dashboard-stats", methods=["GET"])
def dashboard_stats_route():
    return AdminController.get_dashboard_stats()

@admin_bp.route("/users", methods=["GET"])
def users_route():
    return AdminController.get_all_users()

@admin_bp.route("/users/<user_id>", methods=["GET"])
def user_by_id_route(user_id):
    return AdminController.get_user_by_id(user_id)

@admin_bp.route("/users/<user_id>", methods=["PUT"])
def update_user_route(user_id):
    return AdminController.update_user(user_id, request)

@admin_bp.route("/users/<user_id>", methods=["DELETE"])
def delete_user_route(user_id):
    return AdminController.delete_user(user_id)

@admin_bp.route("/projects", methods=["GET"])
def projects_route():
    return AdminController.get_all_projects()

@admin_bp.route("/projects/<project_id>", methods=["GET"])
def project_by_id_route(project_id):
    return AdminController.get_project_by_id(project_id)

@admin_bp.route("/projects/<project_id>", methods=["DELETE"])
def delete_project_route(project_id):
    return AdminController.delete_project(project_id)

@admin_bp.route("/system-metrics", methods=["GET"])
def system_metrics_route():
    time_range = request.args.get("timeRange", "day")
    return AdminController.get_system_metrics(time_range)

@admin_bp.route("/logs", methods=["GET"])
def logs_route():
    log_type = request.args.get("logType", "all")
    log_level = request.args.get("logLevel", "all")
    limit = request.args.get("limit", 100, type=int)
    return AdminController.get_logs(log_type, log_level, limit) 