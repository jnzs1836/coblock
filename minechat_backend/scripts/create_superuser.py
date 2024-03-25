from django.contrib.auth import get_user_model
import os


def run():
    User = get_user_model()

    username = os.environ.get('SUPERUSER_NAME')
    email = 'admin@example.com'
    password = os.environ.get('SUPERUSER_PASSWORD')

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username, email, password)
