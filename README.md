# Task Manager SaaS

Fullstack SaaS task manager inspired by Trello/Notion, built with Next.js, Express, Prisma, PostgreSQL and Docker.

## Tech Stack

- Frontend: Next.js (App Router), TypeScript, TailwindCSS, Axios, React Query, dnd-kit
- Backend: Node.js, Express, TypeScript, Prisma ORM, JWT auth, bcrypt
- Database: PostgreSQL
- DevOps: Docker, docker-compose

## Monorepo Structure

```text
task-manager-saas
├── frontend
│   ├── app
│   ├── components
│   ├── services
│   └── hooks
├── backend
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── services
│   └── prisma
├── docker-compose.yml
├── API.md
└── README.md
```

## Features

- JWT authentication (register/login)
- Protected API routes
- CRUD projects
- CRUD tasks inside projects
- Task status workflow (`TODO`, `IN_PROGRESS`, `DONE`)
- Drag-and-drop task movement between kanban columns
- Dashboard with counters + recent activity

## Environment Variables

### Root `.env`
Copy from `.env.example`:

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
```

### Backend `.env`
Copy from `backend/.env.example`:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_manager?schema=public
JWT_SECRET=super-secret-jwt-key
JWT_EXPIRES_IN=1d
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
Copy from `frontend/.env.example`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Run with Docker

1. Create env files:
```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

Note: for Docker, keep `DATABASE_URL` from the root `.env` (host `postgres`).
Using `backend/.env` inside containers can override it to `localhost` and break auth/database access.

2. Start services:
```bash
docker compose up --build
```

3. Run Prisma migration (first time):
```bash
docker compose exec backend npm run prisma:migrate
```

4. App URLs:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api`
- Health check: `http://localhost:4000/health`

## Run Locally (without Docker)

1. Install dependencies at root:
```bash
npm install
```

2. Setup PostgreSQL and update `backend/.env` `DATABASE_URL`.

3. Generate Prisma client and run migration:
```bash
npm --workspace backend run prisma:generate
npm --workspace backend run prisma:migrate
```

4. Start apps in parallel:
```bash
npm run dev
```

## Scripts

### Root
- `npm run dev`
- `npm run build`

### Backend
- `npm --workspace backend run dev`
- `npm --workspace backend run build`
- `npm --workspace backend run prisma:migrate`

### Frontend
- `npm --workspace frontend run dev`
- `npm --workspace frontend run build`

## GitHub Publishing

1. Initialize git and first commit:
```bash
git init
git add .
git commit -m "feat: initial fullstack task manager saas"
```

2. Create a GitHub repo, then add remote and push:
```bash
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

## API Reference

See `API.md` for complete endpoint docs.
