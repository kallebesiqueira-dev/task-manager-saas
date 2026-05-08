# TaskFlow

A full-stack SaaS task manager with a Kanban board, built with Next.js, Express, Prisma, PostgreSQL and Docker.

## Screenshots

| Login | Dashboard |
|---|---|
| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) |

| Kanban Board |
|---|
| ![Board](screenshots/board.png) |

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS, React Query, dnd-kit, lucide-react |
| Backend | Node.js, Express, TypeScript, Prisma ORM, JWT, bcrypt, Zod |
| Database | PostgreSQL 16 |
| DevOps | Docker, docker-compose |

## Features

- JWT authentication — register and login with hashed passwords
- Protected routes on both frontend and backend
- Create, rename and delete projects
- Create, edit and delete tasks inside projects
- Task status workflow: `TODO → IN_PROGRESS → DONE`
- Drag-and-drop Kanban board
- Dashboard with stats (projects, to-do, in-progress, done) and recent activity
- Professional UI with modals, skeleton loading states and empty states

## Project Structure

```
taskflow/
├── frontend/               # Next.js app
│   ├── app/                # Pages (login, register, dashboard, board)
│   ├── components/         # UI components (Kanban, ProjectCard, Modal, AuthGuard)
│   ├── hooks/              # React Query hooks
│   ├── services/           # Axios API clients
│   ├── context/            # Auth context
│   └── types/              # TypeScript interfaces
├── backend/                # Express API
│   ├── controllers/        # Route handlers
│   ├── routes/             # Express routers
│   ├── services/           # Business logic
│   ├── middleware/         # Auth + error handling
│   ├── utils/              # JWT helpers
│   └── prisma/             # Schema + Prisma client
├── docker-compose.yml
├── API.md                  # Full API reference
└── README.md
```

## Quick Start (Docker)

### 1. Create env files

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

### 2. Start all services

```bash
docker compose up --build
```

> First run downloads images and compiles both apps — takes 2–3 minutes.

### 3. Apply database schema (first time only)

```bash
docker compose exec backend npx prisma db push
```

### 4. Open the app

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000/api |
| Health check | http://localhost:4000/health |

Create a new account at **http://localhost:3000/register** to get started.

---

## Run Locally (without Docker)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the backend

Copy `backend/.env.example` to `backend/.env` and set your local PostgreSQL connection:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_manager?schema=public
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### 3. Configure the frontend

Copy `frontend/.env.example` to `frontend/.env`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 4. Apply database schema and start

```bash
npm --workspace backend run prisma:generate
cd backend && npx prisma db push && cd ..
npm run dev
```

---

## Environment Variables

### Root `.env` (used by Docker Compose)

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=task_manager
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/task_manager?schema=public
JWT_SECRET=super-secret-jwt-key
JWT_EXPIRES_IN=1d
API_PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000/api
FRONTEND_URL=http://localhost:3000,http://127.0.0.1:3000,http://0.0.0.0:3000
```

> The `DATABASE_URL` in the root `.env` uses `@postgres` (Docker service hostname). For local dev, use `@localhost` in `backend/.env`.

### Vercel / Production

Set in your hosting dashboard:

- `NEXT_PUBLIC_API_URL=https://<your-backend-domain>/api`

Or leave `NEXT_PUBLIC_API_URL` unset and set `BACKEND_URL=https://<your-backend-domain>` so Next.js proxies `/api/*` requests to the backend.

---

## NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend + backend in parallel |
| `npm run build` | Build both apps |
| `npm --workspace backend run dev` | Backend only |
| `npm --workspace frontend run dev` | Frontend only |
| `npm --workspace backend run prisma:migrate` | Run Prisma migrations |

---

## API Reference

See [`API.md`](./API.md) for the full endpoint documentation.
