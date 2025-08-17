# Stage 1: Build the application
# Hum ek temporary Java environment ka istemaal karenge taaki project ko build kar sakein
FROM maven:3.8.5-openjdk-17 AS build

# Apne project code ko container ke andar copy karein
WORKDIR /app
COPY . .

# Maven se project ko build karein. Yeh target folder mein ek .jar file banayega.
RUN mvn clean install -DskipTests

# Stage 2: Run the application
# Ab hum ek chote, saaf-suthre Java environment ka istemaal karenge
FROM openjdk:17-jdk-slim

# Build stage se bani hui .jar file ko is naye environment mein copy karein
COPY --from=build /app/target/*.jar app.jar

# Port 8080 ko bahar ki duniya ke liye kholein
EXPOSE 8080

# Application ko run karne ki final command
ENTRYPOINT ["java","-jar","/app.jar"]