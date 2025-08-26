# TaskForge API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

Most endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Public Endpoints

### Health & Info

- `GET /health` - Health check
- `GET /info` - API information

## Authentication Endpoints

### User Authentication

- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - User login
- `GET /auth/profile` - Get current user profile (protected)

## User Management

### Users

- `GET /users` - Get all users (protected)
- `GET /users/:id` - Get user by ID (protected)
- `PATCH /users/:id` - Update user by ID (protected)
- `DELETE /users/:id` - Delete user by ID (protected)

## Project Management

### Projects

- `POST /projects` - Create new project (protected, validated)
- `GET /projects` - Get all projects for authenticated user (protected)
- `GET /projects/trash` - Get deleted projects (protected)
- `GET /projects/:id` - Get project by ID (protected)
- `PATCH /projects/:id` - Update project by ID (protected, validated)
- `DELETE /projects/:id` - Soft delete project (protected)
- `PATCH /projects/:id/restore` - Restore deleted project (protected)
- `DELETE /projects/:id/permanent` - Permanently delete project (protected)

### Project Schema

```json
{
  "name": "string (required, 1-100 chars)",
  "description": "string (required, max 500 chars)",
  "color": "string (hex color, default: #3b82f6)",
  "status": "enum: active|on-hold|completed|archived (default: active)",
  "priority": "enum: low|medium|high|urgent (default: medium)",
  "dueDate": "date (optional)",
  "progress": "number (0-100, default: 0)",
  "tags": "array of strings (optional)",
  "notes": "string (optional)"
}
```

## Task Management

### Tasks

- `POST /tasks` - Create new task (protected, validated)
- `GET /tasks` - Get all tasks for authenticated user (protected)
  - Query params: `?projectId=<id>` to filter by project
- `GET /tasks/trash` - Get deleted tasks (protected)
- `GET /tasks/:id` - Get task by ID (protected)
- `PATCH /tasks/:id` - Update task by ID (protected, validated)
- `DELETE /tasks/:id` - Soft delete task (protected)
- `PATCH /tasks/:id/restore` - Restore deleted task (protected)
- `DELETE /tasks/:id/permanent` - Permanently delete task (protected)
- `GET /tasks/:id/history` - Get task audit trail (protected)

### Task Schema

```json
{
  "title": "string (required, 1-200 chars)",
  "description": "string (max 1000 chars)",
  "project_id": "MongoDB ObjectId (required)",
  "status": "enum: new|in-progress|completed (default: new)",
  "priority": "enum: low|medium|high|urgent (default: medium)",
  "dueDate": "date (optional)",
  "estimatedMinutes": "number (optional)",
  "actualMinutes": "number (optional)",
  "tags": "array of strings (optional)",
  "assignee": "string (optional)"
}
```

### Subtasks

- `POST /tasks/:id/subtasks` - Add subtask to task (protected, validated)
- `PATCH /tasks/:id/subtasks/:subtaskId` - Update subtask (protected)
- `DELETE /tasks/:id/subtasks/:subtaskId` - Delete subtask (protected)

### Subtask Schema

```json
{
  "title": "string (required, 1-200 chars)",
  "description": "string (optional, max 500 chars)"
}
```

## Trash Management

### Unified Trash Operations

- `GET /trash` - Get all deleted items (projects and tasks) (protected)
- `PATCH /trash/:itemType/:itemId/restore` - Restore item (protected)
  - itemType: `project` or `task`
- `DELETE /trash/:itemType/:itemId/permanent` - Permanently delete item (protected)
- `DELETE /trash/empty` - Empty entire trash (protected)

### Trash Response Format

```json
{
  "total": "number",
  "projects": "number",
  "tasks": "number",
  "items": [
    {
      "id": "string",
      "type": "project|task",
      "deletedAt": "date",
      "...": "other item properties"
    }
  ]
}
```

## Dashboard

### Analytics

- `GET /dashboard` - Get dashboard analytics (protected)

## Response Formats

### Success Response

```json
{
  "id": "string",
  "...": "data properties",
  "createdAt": "date",
  "lastUpdated": "date"
}
```

### Error Response

```json
{
  "message": "Error description",
  "error": "Error details (optional)",
  "errors": "Validation errors array (optional)"
}
```

### Validation Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Features

### Soft Delete

- Projects and tasks use soft delete (marked as deleted, not removed)
- Deleted items can be restored or permanently deleted
- Associated tasks are deleted when project is deleted

### Audit Trail

- Tasks maintain complete audit trails
- Track creation, updates, deletions, and restorations
- Record user information and timestamps for all changes

### Validation

- Input validation using express-validator
- Field length limits and format validation
- Enum validation for status and priority fields

### Security

- JWT-based authentication
- User isolation (users can only access their own data)
- CORS protection
- Request validation and sanitization

## Environment Variables

```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/taskforge
JWT_SECRET=your_jwt_secret
```
