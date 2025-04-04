from flask import Blueprint, request, jsonify
from controllers.admin_controller import AdminController
from middleware.auth_middleware import requires_admin

# Create a Blueprint for admin routes
admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/dashboard-stats", methods=["GET"])
@requires_admin
def dashboard_stats_route(user_id):
    return AdminController.get_dashboard_stats()


@admin_bp.route("/activity/recent", methods=["GET"])
@requires_admin
def recent_activity_route(user_id):
    limit = request.args.get("limit", 5, type=int)
    return AdminController.get_recent_activity(limit)


@admin_bp.route("/projects/processing", methods=["GET"])
@requires_admin
def processing_queue_route(user_id):
    limit = request.args.get("limit", 3, type=int)
    return AdminController.get_processing_queue(limit)


@admin_bp.route("/users", methods=["GET"])
@requires_admin
def users_route(user_id):
    return AdminController.get_all_users()


@admin_bp.route("/users/<user_id>", methods=["GET"])
@requires_admin
def user_by_id_route(user_id, user_id_param):
    return AdminController.get_user_by_id(user_id_param)


@admin_bp.route("/users/<user_id>", methods=["PUT"])
@requires_admin
def update_user_route(user_id, user_id_param):
    return AdminController.update_user(user_id_param, request)


@admin_bp.route("/users/<user_id>", methods=["DELETE"])
@requires_admin
def delete_user_route(user_id, user_id_param):
    return AdminController.delete_user(user_id_param)


@admin_bp.route("/projects", methods=["GET"])
@requires_admin
def projects_route(user_id):
    return AdminController.get_all_projects()


@admin_bp.route("/projects/<project_id>", methods=["GET"])
@requires_admin
def project_by_id_route(user_id, project_id):
    return AdminController.get_project_by_id(project_id)


@admin_bp.route("/projects/<project_id>", methods=["DELETE"])
@requires_admin
def delete_project_route(user_id, project_id):
    return AdminController.delete_project(project_id)


@admin_bp.route("/system-metrics", methods=["GET"])
@requires_admin
def system_metrics_route(user_id):
    time_range = request.args.get("timeRange", "day")
    return AdminController.get_system_metrics(time_range)


@admin_bp.route("/logs", methods=["GET"])
@requires_admin
def logs_route(user_id):
    log_type = request.args.get("logType", "all")
    log_level = request.args.get("logLevel", "all")
    limit = request.args.get("limit", 100, type=int)
    return AdminController.get_logs(log_type, log_level, limit)
