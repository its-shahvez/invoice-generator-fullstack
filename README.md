QuickInvoice - Full-Stack Invoice Generator
This repository contains the complete source code for the QuickInvoice application, a full-stack web application designed to streamline the process of creating, managing, and sending professional invoices. Built with a focus on user-friendliness and efficiency, QuickInvoice provides a robust solution for individuals and businesses alike.

📂 Folder Structure
This project follows a monorepo structure, housing both the frontend and backend components within a single repository for easier management and development.

/invoicegeneratefronted: This directory contains the complete codebase for the frontend of the application, built using React.js and Vite.

/invoicegeneratorapi: This directory houses the backend API of the application, developed using Spring Boot, Java, and integrated with MongoDB.

✨ Key Features
Secure User Authentication: Implements robust user authentication and authorization mechanisms using Clerk for the frontend and Spring Security for the backend, ensuring that user data and invoices are protected.

User-Specific Invoice Management: Enables users to create, save, update, and delete their own invoices securely. Data is segregated, ensuring that users can only access and manage their respective invoice records.

Professional Invoice Templates: Offers a selection of professionally designed invoice templates, allowing users to customize the appearance of their invoices to match their brand.

PDF Invoice Generation: Provides the functionality to download generated invoices as high-quality PDF documents, suitable for sharing and printing.

Direct Email Sending: Integrates with email services (e.g., Gmail SMTP) to allow users to send invoices directly to their clients from within the application.

Clerk Webhooks for User Data Synchronization: Leverages Clerk's webhook capabilities to ensure seamless synchronization of user-related data between the authentication provider and the application's backend database (MongoDB).

🛠️ Tech Stack
The QuickInvoice application is built using the following key technologies:

Frontend---:

Framework: React.js - A JavaScript library for building user interfaces or UI components.

Build Tool: Vite - A next-generation frontend tooling that provides an extremely fast development experience.

State Management: (Implicit through React Hooks)

Styling: Bootstrap - A popular CSS framework for building responsive and mobile-first websites.

HTTP Client: Axios - A promise-based HTTP client for making API requests.

Authentication: Clerk - Provides a comprehensive set of tools for user authentication and management.

Backend:

Framework: Spring Boot - A powerful Java-based framework for building microservices and web applications.

Language: Java - A widely-used, object-oriented programming language.

Database: MongoDB - A NoSQL document database used for storing application data, including user information and invoices.

Data Access: Spring Data MongoDB - Simplifies the integration and interaction with MongoDB.

Security: Spring Security - A robust and highly customizable security framework for Spring applications, used here to protect API endpoints.

Email Service: Jakarta Mail (formerly JavaMail) integrated with Gmail SMTP for sending emails.

Webhooks: Clerk Webhooks - Used for real-time updates on user events, ensuring data consistency.

🚀 How to Run
To run the QuickInvoice application locally, follow these steps:

Backend Setup
Navigate to the backend directory:
bash cd invoicegeneratorapi 

Ensure you have Java Development Kit (JDK) installed.

Ensure you have MongoDB installed and running. Update the application.properties file with your MongoDB connection details.

Run the Spring Boot application using your preferred IDE (like IntelliJ IDEA) or via Maven:
bash ./mvnw spring-boot:run 

Frontend Setup
Open a new terminal and navigate to the frontend directory:
bash cd invoicegeneratedfronted 

Ensure you have Node.js and npm (or yarn) installed.

Install dependencies:
``bash
npm install

or
yarn install
``

Create a .env file in the root of the frontend directory and add your Clerk publishable key and the backend API base URL:
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key VITE_API_BASE_URL=http://localhost:8080/api
Replace your_clerk_publishable_key with your actual Clerk publishable key.

Start the development server:
``bash
npm run dev

or
yarn dev
