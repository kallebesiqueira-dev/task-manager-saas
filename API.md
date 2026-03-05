# API Documentation

Base URL: `http://localhost:4000/api`

## Authentication

### `POST /auth/register`
Create a new user account.

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

Response `201`:
```json
{
  "token": "jwt-token",
  "user": {
    "id": "cuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-03-05T00:00:00.000Z"
  }
}
```

### `POST /auth/login`
Log in an existing user.

Request body:
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Response `200`: same shape as register response.

## Projects (Protected)
Use header: `Authorization: Bearer <token>`

### `GET /projects`
List projects owned by authenticated user.

### `POST /projects`
Create project.

Request body:
```json
{ "name": "Marketing Roadmap" }
```

### `PUT /projects/:id`
Update project name.

### `DELETE /projects/:id`
Delete project and related tasks.

## Tasks (Protected)

### `GET /projects/:projectId/tasks`
List tasks by project.

### `POST /projects/:projectId/tasks`
Create task in project.

Request body:
```json
{
  "title": "Design landing page",
  "description": "Create new hero section"
}
```

### `PUT /tasks/:id`
Update task fields.

Request body:
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS"
}
```

### `PATCH /tasks/:id/status`
Update task status only.

Request body:
```json
{ "status": "DONE" }
```

### `DELETE /tasks/:id`
Delete task.

## Dashboard (Protected)

### `GET /dashboard`
Returns dashboard metrics and recent activity.

Response `200`:
```json
{
  "projectCount": 2,
  "taskCounters": {
    "todo": 5,
    "inProgress": 3,
    "done": 8
  },
  "recentActivity": [
    {
      "id": "task-id",
      "title": "Deploy API",
      "description": null,
      "status": "DONE",
      "projectId": "project-id",
      "createdAt": "2026-03-05T00:00:00.000Z",
      "project": {
        "id": "project-id",
        "name": "Platform"
      }
    }
  ]
}
```
