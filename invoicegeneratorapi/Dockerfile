
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

# === FINAL CMD: Inject MongoDB variables from Railway ===
CMD bash -c "java \
  -Dspring.data.mongodb.host=$MONGO_HOST \
  -Dspring.data.mongodb.port=$MONGO_PORT \
  -Dspring.data.mongodb.database=$MONGO_DB \
  -jar target/invoicegeneratorapi-0.0.1-SNAPSHOT.jar"


