# TaskForge API - cURL Commands

This document contains all the cURL commands for testing the TaskForge API endpoints.

**Base URL**: `http://localhost:3001`

## 🔐 Authentication Endpoints

### 1. User Signup (Registration)

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123",
    "role": "user",
    "gender": "male"
  }'
```

### 2. User Signin (Login)

```bash
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

---

## 👥 User Management Endpoints

### 3. User Login (Alternative endpoint)

```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

### 4. User Signup (Alternative endpoint)

```bash
curl -X POST http://localhost:3001/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "janedoe",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane.doe@example.com",
    "password": "securepassword456",
    "role": "user",
    "gender": "female"
  }'
```

### 5. Get All Users

```bash
curl -X GET http://localhost:3001/api/users/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 6. Create New User (Admin)

```bash
curl -X POST http://localhost:3001/api/users/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "username": "newuser",
    "first_name": "New",
    "last_name": "User",
    "email": "newuser@example.com",
    "password": "newpassword123",
    "role": "user",
    "gender": "other"
  }'
```

### 7. Get User by ID

```bash
curl -X GET http://localhost:3001/api/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 8. Update User by ID

```bash
curl -X PATCH http://localhost:3001/api/users/USER_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "first_name": "Updated",
    "last_name": "Name",
    "email": "updated.email@example.com"
  }'
```

### 9. Delete User by ID

```bash
curl -X DELETE http://localhost:3001/api/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 📋 Project Management Endpoints

### 10. Create Project

```bash
curl -X POST http://localhost:3001/api/projects/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "My First Project",
    "description": "This is a sample project description"
  }'
```

### 11. Get All Projects (for authenticated user)

```bash
curl -X GET http://localhost:3001/api/projects/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 12. Get Project by ID

```bash
curl -X GET http://localhost:3001/api/projects/PROJECT_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 13. Update Project by ID

```bash
curl -X PATCH http://localhost:3001/api/projects/PROJECT_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Updated Project Title",
    "description": "Updated project description"
  }'
```

### 14. Delete Project by ID

```bash
curl -X DELETE http://localhost:3001/api/projects/PROJECT_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## ✅ Task Management Endpoints

### 15. Create Task

```bash
curl -X POST http://localhost:3001/api/tasks/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "My First Task",
    "description": "This is a sample task description",
    "projectId": "PROJECT_ID_HERE",
    "totalPoints": 100
  }'
```

### 16. Get All Tasks (for authenticated user)

```bash
curl -X GET http://localhost:3001/api/tasks/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 17. Get Tasks by Project ID

```bash
curl -X GET "http://localhost:3001/api/tasks/?projectId=PROJECT_ID_HERE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 18. Get Task by ID

```bash
curl -X GET http://localhost:3001/api/tasks/TASK_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 19. Update Task by ID

```bash
curl -X PATCH http://localhost:3001/api/tasks/TASK_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Updated Task Title",
    "description": "Updated task description",
    "totalPoints": 150,
    "dailyPoints": 50
  }'
```

### 20. Delete Task by ID

```bash
curl -X DELETE http://localhost:3001/api/tasks/TASK_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 📈 Dashboard Endpoints

### 21. Get Dashboard Overview

```bash
curl -X GET http://localhost:3001/api/dashboard/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🧪 Testing Workflow Example

Here's a complete workflow for testing the API:

### Step 1: Register a new user

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "testpassword123",
    "role": "user",
    "gender": "other"
  }'
```

### Step 2: Login to get JWT token

```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpassword123"
  }'
```

### Step 3: Create a project (replace TOKEN with actual JWT)

```bash
curl -X POST http://localhost:3001/api/projects/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Test Project",
    "description": "A project for testing"
  }'
```

### Step 4: Create a task (replace TOKEN and PROJECT_ID)

```bash
curl -X POST http://localhost:3001/api/tasks/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Test Task",
    "description": "A task for testing",
    "projectId": "PROJECT_ID",
    "totalPoints": 100
  }'
```

### Step 5: Get dashboard overview

```bash
curl -X GET http://localhost:3001/api/dashboard/overview \
  -H "Authorization: Bearer TOKEN"
```

---

## 📝 Notes

1. **Replace placeholders**:

   - `YOUR_JWT_TOKEN_HERE` with actual JWT token from login
   - `USER_ID_HERE` with actual user MongoDB ObjectId
   - `PROJECT_ID_HERE` with actual project MongoDB ObjectId
   - `TASK_ID_HERE` with actual task MongoDB ObjectId

2. **Server must be running**: Make sure the backend server is running on port 3001

3. **Content-Type**: Always include `Content-Type: application/json` for POST/PATCH requests

4. **Authorization**: Protected routes require `Authorization: Bearer <token>` header

5. **Response formats**: All responses are in JSON format

6. **Error handling**: Check HTTP status codes for success/error responses

7. **MongoDB**: Make sure MongoDB connection is working (check the .env file)

## 🚀 Quick Start Commands

Start the backend server:

```bash
cd backend
npm install
npm start
```

The server will be available at `http://localhost:3001`
