import os
import psutil
import time
import datetime
import random
import glob
import re

class AdminService:
    
    @staticmethod
    def get_uptime_string():
        """Get system uptime as a formatted string"""
        try:
            # Get system uptime in seconds
            uptime_seconds = time.time() - psutil.boot_time()
            
            # Convert to days, hours, minutes
            days = int(uptime_seconds // (24 * 3600))
            uptime_seconds %= (24 * 3600)
            hours = int(uptime_seconds // 3600)
            uptime_seconds %= 3600
            minutes = int(uptime_seconds // 60)
            
            return f"{days}d {hours}h {minutes}m"
        except:
            return "Unknown"
    
    @staticmethod
    def get_daily_uploads():
        """Get number of uploads in the last 24 hours"""
        try:
            # For a real implementation, you would query the database
            # for projects created in the last 24 hours
            return random.randint(5, 20)  # Placeholder for demo
        except:
            return 0
    
    @staticmethod
    def get_storage_used():
        """Get the total storage used by the application"""
        try:
            # Get the size of the BVHs directory (adjust path as needed)
            bvh_size = sum(os.path.getsize(f) for f in glob.glob('BVHs/**/*') if os.path.isfile(f))
            
            # Convert to human-readable format
            for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
                if bvh_size < 1024.0:
                    return f"{bvh_size:.1f} {unit}"
                bvh_size /= 1024.0
            
            return "0 B"  # Fallback
        except:
            return "Unknown"
    
    @staticmethod
    def get_system_metrics(time_range):
        """Get system metrics based on time range"""
        try:
            # In a real implementation, you would retrieve historical data
            # from a monitoring system. Here we'll generate mock data.
            
            # Define data points based on time range
            if time_range == "day":
                data_points = 24  # Hourly for a day
                labels = [f"{i}:00" for i in range(24)]
            elif time_range == "week":
                data_points = 7  # Daily for a week
                labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            else:  # month
                data_points = 30  # Daily for a month
                labels = [f"Day {i+1}" for i in range(30)]
            
            # Generate random metrics with some patterns
            cpu_data = [random.randint(20, 80) for _ in range(data_points)]
            memory_data = [random.randint(40, 90) for _ in range(data_points)]
            
            # Add some correlation between CPU and processing history
            processing_history = [max(15, int(cpu * 0.8 + random.randint(-10, 10))) for cpu in cpu_data]
            error_rate = [max(0, int(cpu * 0.1 + random.randint(-3, 5))) for cpu in cpu_data]
            
            return {
                "timeRange": time_range,
                "labels": labels,
                "cpu": cpu_data,
                "memory": memory_data,
                "processingHistory": processing_history,
                "errorRate": error_rate,
                "diskUsage": psutil.disk_usage('/').percent,
                "avgProcessTime": "2m 45s" if time_range == "day" else "3m 10s" if time_range == "week" else "3m 30s"
            }
        except Exception as e:
            print(f"Error getting system metrics: {e}")
            return {"error": str(e)}
    
    @staticmethod
    def get_logs(log_type="all", log_level="all", limit=100):
        """Get system logs filtered by type and level"""
        try:
            # In a real implementation, you would read logs from file or database
            # Here we'll generate mock logs
            
            log_types = ["auth", "processor", "system", "database"] if log_type == "all" else [log_type]
            log_levels = ["info", "warning", "error"] if log_level == "all" else [log_level]
            
            logs = []
            current_time = datetime.datetime.now()
            
            # Generate random logs with some patterns
            for i in range(limit):
                # Random time in the past (up to 2 hours ago)
                log_time = current_time - datetime.timedelta(minutes=random.randint(1, 120))
                
                # Select random log type and level based on filters
                type_choice = random.choice(log_types)
                
                # Make errors less common than other levels
                level_weights = {
                    "info": 0.6,
                    "warning": 0.3,
                    "error": 0.1
                }
                level_choices = [level for level in log_levels if level in level_weights]
                if not level_choices:
                    continue
                
                weights = [level_weights[level] for level in level_choices]
                total = sum(weights)
                weights = [w/total for w in weights]  # Normalize weights
                level_choice = random.choices(level_choices, weights=weights, k=1)[0]
                
                # Generate message based on type and level
                message = AdminService._generate_log_message(type_choice, level_choice)
                
                logs.append({
                    "id": i + 1,
                    "timestamp": log_time.strftime("%Y-%m-%d %H:%M:%S"),
                    "level": level_choice,
                    "message": message,
                    "service": type_choice
                })
            
            # Sort logs by timestamp (newest first)
            logs.sort(key=lambda x: x["timestamp"], reverse=True)
            
            return logs[:limit]
        except Exception as e:
            print(f"Error getting logs: {e}")
            return []
    
    @staticmethod
    def _generate_log_message(log_type, log_level):
        """Generate mock log messages based on type and level"""
        messages = {
            "auth": {
                "info": [
                    "User login successful",
                    "New user registered",
                    "User logged out"
                ],
                "warning": [
                    "Multiple failed login attempts",
                    "Password reset requested",
                    "Session expired"
                ],
                "error": [
                    "Authentication failed: Invalid credentials",
                    "User account locked after multiple attempts",
                    "Security breach detected"
                ]
            },
            "processor": {
                "info": [
                    "Processing started for video",
                    "Video processing completed successfully",
                    "BVH file generated"
                ],
                "warning": [
                    "Processing taking longer than expected",
                    "Low quality video detected",
                    "Suboptimal pose detection results"
                ],
                "error": [
                    "Failed to process video: Unsupported format",
                    "Processing pipeline crashed",
                    "BVH generation failed"
                ]
            },
            "system": {
                "info": [
                    "System startup complete",
                    "Background cleanup task completed",
                    "Cache refreshed"
                ],
                "warning": [
                    "High CPU usage detected",
                    "Disk space running low",
                    "Memory usage above threshold"
                ],
                "error": [
                    "System error: Out of memory",
                    "Critical service unavailable",
                    "File system error"
                ]
            },
            "database": {
                "info": [
                    "Database connection established",
                    "Query completed successfully",
                    "Database maintenance completed"
                ],
                "warning": [
                    "Slow query detected",
                    "Database approaching size limit",
                    "Connection pool reaching capacity"
                ],
                "error": [
                    "Database connection timeout",
                    "Query failed: Syntax error",
                    "Database constraint violation"
                ]
            }
        }
        
        return random.choice(messages.get(log_type, {}).get(log_level, ["Unknown log message"])) 