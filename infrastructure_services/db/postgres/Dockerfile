# Dockerfile
FROM mysql:8.4

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=sahihi_mysql_password
ENV MYSQL_DATABASE=sahihi_mysql_database
ENV MYSQL_USER=sahihi_mysql_user
ENV MYSQL_PASSWORD=sahihi_mysql_password

# Copy the custom entrypoint script into the container
COPY init.sql /docker-entrypoint-initdb.d/init.sql

# Expose the MySQL port
EXPOSE 3306