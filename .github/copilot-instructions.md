# TaskForge AI Coding Agent Instructions

## Architecture Overview

TaskForge is a full-stack project management application with a Next.js frontend and Express.js backend, using MongoDB for persistence.

**Key Components:**

- **Frontend**: Next.js 15 with TypeScript, Radix UI components, TailwindCSS
- **Backend**: Express.js with MongoDB/Mongoose, JWT authentication
- **Structure**: Monorepo with `/frontend` and `/backend` directories

## Development Workflow

### Starting the Application

```bash
# Backend (from /backend directory)
nodemon index.js  # Runs on port 3001

# Frontend (from /frontend directory)
npm run dev      # Runs on port 3000
```

### API Testing

Use the `api-curl-commands.md` file for testing endpoints. Backend health check: `GET http://localhost:3001/api/health`

## Critical Data Models & Patterns

### Task Model Architecture

- **Hierarchical**: Tasks contain embedded `subtasks` array with independent lifecycle
- **Audit Trail**: All task changes logged in `auditTrail` array with userId/userName
- **Soft Delete**: `isDeleted: boolean` + `deletedAt: Date` pattern used throughout
- **References**: Tasks link to Projects via `project: ObjectId` and Users via `user: ObjectId`

### API Response Transformation

Backend controllers use `transformTask()` and similar functions to convert MongoDB `_id` to frontend-expected `id` field:

```javascript
// Always transform MongoDB docs for frontend
function transformTask(task) {
  return {
    id: task._id, // Convert _id to id
    projectId: task.project, // Convert project to projectId
    // ... other mappings
  };
}
```

## Authentication & State Management

### Token-Based Flow

- JWT stored in `localStorage` as `taskforge-token`
- User data stored as `taskforge-user`
- API requests auto-include `Authorization: Bearer <token>` header via `makeRequest()` helper
- 401 responses automatically clear localStorage and redirect to login

### Context Providers Hierarchy

```tsx
<AuthProvider>
  <ProjectsProvider>
    <TasksProvider>
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </TasksProvider>
  </ProjectsProvider>
</AuthProvider>
```

## API Design Patterns

### Unified Trash System

All deletable resources use soft delete with centralized trash management:

- `DELETE /api/projects/:id` → soft delete (sets `isDeleted: true`)
- `PATCH /api/trash/project/:id/restore` → restore item
- `DELETE /api/trash/project/:id/permanent` → hard delete

### Validation Chain

All routes use express-validator middleware:

```javascript
router.post("/tasks", validateTaskCreation, authenticateToken, createTask);
```

### Error Handling

- Backend: Centralized `errorHandler` middleware for consistent error responses
- Frontend: API calls wrapped in try-catch with toast notifications via `useToast()`

## Component Architecture

### UI Component Library

Extensive Radix UI component system in `/components/ui/` - always use existing components before creating new ones.

### Page Structure Pattern

```tsx
// Typical page component structure
"use client";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

export function ComponentName() {
  const { user } = useAuth();
  // Component logic
}
```

## Database Conventions

### Connection Management

- Single connection in `/backend/config/connection.js`
- **Note**: Contains hardcoded MongoDB URI - handle with environment variables in production

### Schema Patterns

- All schemas include `timestamps: true` for automatic `createdAt`/`updatedAt`
- Enums used extensively for status fields: `["new", "in-progress", "completed"]`
- Default values set at schema level rather than application level

## Key Integration Points

### Frontend API Layer (`/lib/api.ts`)

Centralized API service with typed interfaces. All API calls flow through `makeRequest()` helper which handles authentication and error responses.

### Cross-Component Communication

- Projects and Tasks share data via React Context
- Trash operations update multiple contexts simultaneously
- Real-time updates achieved through context re-fetching after mutations

## Development Guidelines

### Adding New Features

1. Update Mongoose schema with validation
2. Add controller with transformation function
3. Create route with validation middleware
4. Update frontend API service in `lib/api.ts`
5. Update relevant React contexts
6. Add UI components using existing design system

### Authentication-Required Routes

Always use `authenticateToken` middleware and access user via `req.user.id` (not `req.user._id`).

### Frontend API Calls

Always handle loading states and error cases with toast notifications. Use the established pattern of context providers for state management.
