from flask_mail import Mail
from itsdangerous import URLSafeTimedSerializer
import os 

serializer = URLSafeTimedSerializer(os.getenv('SECRET_KEY', 'secret_key'))

mail = Mail()
