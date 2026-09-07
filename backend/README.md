# LeadPro CRM Backend

## Overview

LeadPro CRM Backend is a professional REST API built with **Node.js**, **Express** and **TypeScript**. It follows a clean, layered architecture that separates configuration, routing, controllers, services, repositories, middlewares, types and utilities.

The React frontend is a separate application and communicates with this backend exclusively through the REST API. The frontend never accesses the database directly.

## Tech Stack

- Node.js (>= 22.12.0)
- Express
- TypeScript (strict mode)
- dotenv
- cors
- helmet
- ESLint
- Prettier

## Project Structure

```
backend/
├── database/           # SQL scripts (schema + seed) — Jour 3
│   ├── create-database.sql
│   ├── schema.sql
│   └── seed.sql
├── src/
│   ├── config/         # Centralized environment configuration
│   ├── controllers/    # HTTP request handlers
│   ├── middlewares/    # Express middlewares (error, not found, auth, ...)
│   ├── repositories/   # Data access layer (MySQL prepared for Jour 2)
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic layer
│   ├── types/          # Shared TypeScript types
│   ├── utils/          # Reusable helpers
│   ├── app.ts          # Express application configuration
│   └── server.ts       # Server bootstrap / startup
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── prettier.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Database (MySQL / XAMPP)

The CRM uses a **MySQL** relational database named `leadpro_crm` (18 tables).
All SQL files are plain SQL — no ORM. They are located in `backend/database/`.

Database structure summary (Jour 3):

| Table | Purpose |
| ----- | ------- |
| `roles` | Application roles (Admin, Manager, Sales, Support) |
| `users` | CRM users (soft delete) |
| `teams` | Sales teams |
| `team_members` | users ↔ teams pivot table |
| `companies` | Companies / accounts (soft delete) |
| `contacts` | Company contacts (soft delete) |
| `lead_sources` | Lead acquisition sources |
| `leads` | Prospects (soft delete) |
| `pipelines` | Sales pipelines |
| `pipeline_stages` | Pipeline stages (New → Lost) |
| `opportunities` | Sales opportunities (soft delete) |
| `tasks` | Tasks (soft delete) |
| `calendar_events` | Calendar events (soft delete) |
| `activities` | CRM activity history |
| `notifications` | In-app notifications |
| `settings` | Per-user preferences |
| `ai_conversations` | AI assistant conversations |
| `ai_messages` | AI conversation messages |

### Import schema

```bash
# Via phpMyAdmin (XAMPP):
#   1. Start Apache + MySQL in the XAMPP Control Panel
#   2. Open http://localhost/phpmyadmin
#   3. Import → choose backend/database/schema.sql
#   4. Click "Go"

# Or via CLI (Windows — adjust mysql path if needed):
cd backend
mysql -u root -p < database/schema.sql
```

### Import seed

```bash
# Via phpMyAdmin (XAMPP):
#   1. Open http://localhost/phpmyadmin
#   2. Select the leadpro_crm database
#   3. Import → choose backend/database/seed.sql
#   4. Click "Go"

# Or via CLI (Windows):
cd backend
mysql -u root -p leadpro_crm < database/seed.sql
```

> ⚠️ With XAMPP the default MySQL user is `root` with an **empty password** (`mysql -u root`).

## Development

Install dependencies:

```bash
npm install
```

Start the development server (with hot reload):

```bash
npm run dev
```

The server listens on `http://localhost:5000` by default.

## Build

Compile TypeScript to the `dist/` folder:

```bash
npm run build
```

## Production

Run the compiled JavaScript server:

```bash
npm start
```

## Health Check

Verify the API is up:

```bash
GET http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "data": {
    "message": "LeadPro CRM API is running",
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
}
```

## Architecture

The request flow follows a strict layered architecture:

```
Client (React)
    ↓
REST API (Express)
    ↓
Controller    → validates/delegates, builds the HTTP response
    ↓
Service       → business logic
    ↓
Repository    → data access (MySQL via mysql2, Jour 2+)
    ↓
Database
```

### Layers

- **Routes** — map HTTP paths and methods to controllers.
- **Controllers** — handle requests and responses, orchestrate services.
- **Services** — contain the business logic.
- **Repositories** — abstract database access.
- **Middlewares** — cross-cutting concerns (error handling, not found, auth, validation, rate limiting).
- **Config** — centralizes environment variables.
- **Types** — shared TypeScript types.
- **Utils** — reusable helpers.

### API Convention

All API routes are prefixed with `/api`. Responses follow a consistent envelope:

Success:

```json
{
  "success": true,
  "data": { }
}
```

Error:

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

## Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Run the TypeScript server in development mode |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled JavaScript server |
| `npm run lint` | Check code with ESLint |
| `npm run typecheck` | Type-check with TypeScript (no emit) |
| `npm run format` | Format code with Prettier |
