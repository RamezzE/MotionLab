from flask import jsonify
from models.user_model import User
from models.project_model import Project
from services.admin_service import AdminService

import datetime
import os
import psutil


class AdminController:

    @staticmethod
    def get_dashboard_stats():
        try:
            # Get total users
            users = User.query.all()
            active_users = [u for u in users if len(
                Project.get_projects_by_user_id(u.id)) > 0]

            # Get projects stats
            projects = Project.query.all()
            processing_projects = [p for p in projects if p.is_processing]

            stats = {
                "totalUsers": len(users),
                "activeUsers": len(active_users),
                "totalProjects": len(projects),
                "processingProjects": len(processing_projects),
                "completedProjects": len(projects) - len(processing_projects),
                "failedProjects": 0,  # We'd need to track failed projects in the database
                "serverLoad": psutil.cpu_percent(),
                "memoryUsage": psutil.virtual_memory().percent,
                "diskUsage": psutil.disk_usage('/').percent,
                "uptime": AdminService.get_uptime_string(),
                "avgProcessingTime": "3m 15s",  # This would come from actual processing metrics
                "dailyUploads": AdminService.get_daily_uploads(),
                "storageUsed": AdminService.get_storage_used()
            }

            return jsonify({"success": True, "data": stats}), 200
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

    @staticmethod
    def get_recent_activity(limit=5):
        try:
            # This would ideally come from an activity log in the database
            # For now, we'll create some mock activity based on existing projects
            projects = Project.query.order_by(
                Project.created_at.desc()).limit(limit).all()

            activity_list = []
            for idx, project in enumerate(projects):
                user = User.get_by_id(project.user_id)
                if user:
                    activity = {
                        "id": idx + 1,
                        "user": user.email,
                        "action": "Created new project" if idx % 3 == 0 else
                        "Uploaded files" if idx % 3 == 1 else
                        "Processed data",
                        "timestamp": project.created_at.isoformat()
                    }
                    activity_list.append(activity)

            return jsonify({"success": True, "data": activity_list}), 200
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

    @staticmethod
    def get_processing_queue(limit=3):
        try:
            # Get only processing projects
            projects = Project.query.filter_by(
                is_processing=True).limit(limit).all()

            queue_list = []
            for idx, project in enumerate(projects):
                # Calculate a fake progress percentage based on creation time
                now = datetime.datetime.utcnow()
                time_diff = (now - project.created_at).total_seconds()
                progress = min(95, int(time_diff / 60 * 10)
                               )  # 10% per minute, max 95%

                # Calculate ETA
                remaining = 100 - progress
                minutes_left = int(remaining / 10)  # 10% per minute

                queue_item = {
                    "id": project.id,
                    "name": project.name,
                    "status": "Processing",
                    "progress": progress,
                    "eta": f"{minutes_left} min" if minutes_left > 0 else "< 1 min"
                }
                queue_list.append(queue_item)

            # If we don't have enough processing projects, add some queued ones
            if len(queue_list) < limit:
                # Create some mock queued projects
                remaining = limit - len(queue_list)
                for i in range(remaining):
                    queue_item = {
                        "id": 1000 + i,
                        "name": f"Queued Project {i+1}",
                        "status": "Queued",
                        "progress": 0,
                        "eta": f"{(i+1) * 5 + 10} min"
                    }
                    queue_list.append(queue_item)

            return jsonify({"success": True, "data": queue_list}), 200
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

    @staticmethod
    def get_all_users():
        try:
            users = User.query.all()
            user_list = []

            for user in users:
                user_dict = user.to_dict()
                projects = Project.get_projects_by_user_id(user.id)
                user_dict["projects"] = len(projects) if projects else 0
                user_dict["status"] = "active" if projects and len(
                    projects) > 0 else "inactive"
                user_list.append(user_dict)

            return jsonify({"success": True, "data": user_list}), 200
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

    @staticmethod
    def get_user_by_id(user_id):
        try:
            user = User.get_by_id(user_id)
            if not user:
                return jsonify({"success": False, "message": "User not found"}), 404

            user_dict = user.to_dict()
            projects = Project.get_projects_by_user_id(user.id)
            user_dict["projects"] = len(projects) if projects else 0
            user_dict["status"] = "active" if projects and len(
                projects) > 0 else "inactive"

            return jsonify({"success": True, "data": user_dict}), 200
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

    @staticmethod
    def update_user(user_id, request):
        try:
            user = User.get_by_id(user_id)
            if not user:
                return jsonify({"success": False, "message": "User not found"}), 404

            data = request.get_json()
            updated_user = user.update(data)

            if not updated_user:
                return jsonify({"success": False, "message": "Failed to update user"}), 400

            return jsonify({"success": True, "data": updated_user.to_dict()}), 200
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

    @staticmethod
    def delete_user(user_id):
        try:
            user = User.get_by_id(user_id)
            if not user:
                return jsonify({"success": False, "message": "User not found"}), 404

            result = user.delete()
            if not result:
                return jsonify({"success": False, "message": "Failed to delete user"}), 400

            return jsonify({"success": True, "message": "User deleted successfully"}), 200
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

    @staticmethod
    def get_all_projects():
        try:
            projects = Project.query.all()
            project_list = []

            for project in projects:
                project_dict = project.to_dict()
                user = User.get_by_id(project.user_id)
                project_dict["owner"] = user.email if user else "Unknown"
                project_dict["status"] = "processing" if project.is_processing else "completed"
                # Convert datetime to string format
                project_dict["creation_date"] = project_dict["creation_date"].strftime(
                    "%Y-%m-%d")
                project_list.append(project_dict)

            return jsonify({"success": True, "data": project_list}), 200
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

    @staticmethod
    def get_project_by_id(project_id):
        try:
            project = Project.get_project_by_id(project_id)
            if not project:
                return jsonify({"success": False, "message": "Project not found"}), 404

            project_dict = project.to_dict()
            user = User.get_by_id(project.user_id)
            project_dict["owner"] = user.email if user else "Unknown"
            project_dict["status"] = "processing" if project.is_processing else "completed"
            # Convert datetime to string format
            project_dict["creation_date"] = project_dict["creation_date"].strftime(
                "%Y-%m-%d")

            return jsonify({"success": True, "data": project_dict}), 200
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

    @staticmethod
    def delete_project(project_id):
        try:
            result = Project.delete_project_by_id(project_id, None)
            if not result:
                return jsonify({"success": False, "message": "Failed to delete project"}), 400

            return jsonify({"success": True, "message": "Project deleted successfully"}), 200
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

    @staticmethod
    def get_system_metrics(time_range):
        try:
            metrics = AdminService.get_system_metrics(time_range)
            return jsonify({"success": True, "data": metrics}), 200
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

    @staticmethod
    def get_logs(log_type, log_level, limit):
        try:
            logs = AdminService.get_logs(log_type, log_level, limit)
            return jsonify({"success": True, "data": logs}), 200
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500
