#!/bin/bash

# Wait for the PostgreSQL container to become available
until PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -c '\q'; do
  echo "Waiting for PostgreSQL container to become available..."
  sleep 1
done

# PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -c "DROP DATABASE IF EXISTS $DB_NAME;"
# PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

# Run the database migrations
# python manage.py flush --skip-checks

python manage.py makemigrations
python manage.py migrate
# python manage.py loaddata data.json
# echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('$SUPERUSER_NAME', 'admin@example.com', '$SUPERUSER_PASSWORD')" | python manage.py shell
# echo "from django.contrib.auth import get_user_model; User = get_user_model(); username = '$SUPERUSER_NAME'; email = 'admin@example.com'; password = '$SUPERUSER_PASSWORD'; if not User.objects.filter(username=username).exists(): User.objects.create_superuser(username, email, password)" | python manage.py shell

# python setup.py
python manage.py runscript create_superuser 


# Start the development server
python manage.py runserver 0.0.0.0:8000
