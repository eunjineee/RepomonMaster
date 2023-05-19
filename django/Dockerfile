FROM python:3.9

# Set the locale
RUN apt-get update && \
    apt-get install -y locales && \
    localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
ENV LANG en_US.utf8

# Copy the project directory into the container
COPY . /app
WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port
EXPOSE 8000

# Start the server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
