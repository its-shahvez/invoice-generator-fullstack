# Stage 1: Build the application using Maven and Java 21
# Use a base image with Java 21
FROM openjdk:21-slim

# Set the working directory inside the container
WORKDIR /app

# Copy ONLY the backend code into the container's /app directory
COPY ./invoice-generator-api /app

# Run the Maven build command from within the /app directory
RUN ./mvnw clean package -DskipTests

# Expose the port the application will run on
EXPOSE 8080

# The command to run the application
CMD ["java", "-jar", "target/invoicegeneratorapi-0.0.1-SNAPSHOT.jar"]