# User Profiler

A user-profile management app built for an interview assignment. Admins add user records to a database; a scheduled cron job periodically finds users who haven't completed their profile yet and emails them a link to update it, repeating on an interval until the profile is completed.

## Tech stack

- Backend: Node.js (Express 4), version 12+
- Frontend: Angular 9 (TypeScript), served as a static build from `client/production/user-profiler`
- Database: SQLite via Sequelize ORM (swappable to mysql/mariadb/postgres/mssql)
- Scheduling: `node-cron`
- Email: `nodemailer`
- Auth/tokens: `jsonwebtoken`
- License: LGPL-3.0

## Project structure

- `app.js` — Express app entry point (serves API + static Angular build, wires up cron jobs)
- `bin/www` — HTTP server bootstrap (`npm start` runs this)
- `routes/` — `index.js` (page routes) and `api.js` (REST API, e.g. user creation)
- `config/config.json` — app configuration (server port, database, SMTP, JWT secret)
- `config/database/` — Sequelize database connection and models
- `cronJobs/newUserMailCron.js` — the recurring "send profile update link" job
- `client/development/user-profiler/` — the Angular 9 source app (edit this)
- `client/production/user-profiler/` — the built/compiled Angular output that Express actually serves

## Prerequisites

- Node.js 12+
- npm
- Angular CLI (`npm i -g @angular/cli`) — only needed if you're modifying the frontend

## Installation

```bash
npm install
```

## Configuration

Edit `config/config.json` before running:
- `database` — `databaseName`, `host`, `port`, `username`, `password`, `dialect` (default: `sqlite`; switch to `mysql`/`mariadb`/`postgres`/`mssql` if needed, installing the matching Sequelize driver)
- `smtp` — mail server host/port/credentials used to send profile-update emails
- `tokenSecretKey` — secret used to sign JWTs

## Running the backend

```bash
npm start
```

Starts the Express server on the configured port (default `8001`), serving both the API and the pre-built Angular frontend from `client/production/user-profiler`.

## Working on the frontend (optional)

```bash
cd client/development/user-profiler
npm install
npm start          # ng serve --open --port 8002 (dev server with live reload)
npm run build       # ng build --prod -> outputs to be copied into client/production/user-profiler
npm test            # ng test (Karma/Jasmine)
npm run e2e          # Protractor e2e tests
```

## API

Create a user via HTTP POST:

```
POST http://localhost:<port>/api/users/
```

Body parameters:
- `email` (required)
- `firstname` (optional)
- `lastname` (optional)
