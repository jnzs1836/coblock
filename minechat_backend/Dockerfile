# Use an official Python runtime as a parent image
FROM python:3.8-slim-buster

# Install build-essential
RUN apt-get update \
    && apt-get install -y build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install libpq-dev
RUN apt-get update \
    && apt-get install -y libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && \
    apt-get install -y postgresql-client


# Set the working directory to /app
WORKDIR /app

RUN apt-get install gcc

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container at /app
COPY . /app/

# Expose port 8000 for the Django server
EXPOSE 8000
# Run the database migrations

COPY . .
# Copy the entrypoint script into the container
COPY docker-entrypoint.sh /docker-entrypoint.sh
# COPY ./scripts/create_superuser.py /setup.py
RUN chmod +x /docker-entrypoint.sh

# Set the entrypoint to the script
ENTRYPOINT ["/docker-entrypoint.sh"]
# Start the Django server
# CMD ["pythonz", "manage.py", "runserver", "0.0.0.0:8000"]
