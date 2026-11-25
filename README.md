# 🎫 Support Ticket Management System

A full-stack help-desk application where users raise support tickets, track their progress and talk to the support team, while admins triage, filter, update and resolve tickets from a dedicated dashboard with live statistics.

Built with the **MERN stack** (MongoDB, Express 5, React 19, Node.js), using **cookie-based JWT authentication**, **role-based access control** and an **event-driven activity log**.

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Architecture](#-architecture)
4. [Project Structure](#-project-structure)
5. [Getting Started](#-getting-started)
6. [Environment Variables](#-environment-variables)
7. [Creating an Admin User](#-creating-an-admin-user)
8. [API Reference](#-api-reference)
9. [Data Models](#-data-models)
10. [Roles & Permissions](#-roles--permissions)
11. [Event-Driven Activity Log](#-event-driven-activity-log)
12. [Frontend Overview](#-frontend-overview)
13. [Security Notes](#-security-notes)
14. [Known Limitations & Roadmap](#-known-limitations--roadmap)
15. [Scripts](#-scripts)

---

## ✨ Features

**For users**
- Register, log in and log out securely (HttpOnly cookie session).
- Create tickets with a title, description, category and priority (`low` / `medium` / `high`).
- View all of your own tickets and filter them by status.
- Edit or delete a ticket while it is still `open`.
- Open a ticket to see its details, the comment thread and a full activity timeline.
- Add comments to your own tickets.

**For admins**
- Dashboard with overview cards: total, open, in-progress and resolved tickets.
- Statistics by status, by priority and tickets created per day over the last 7 days.
- Paginated ticket table across **all** users with **search**, **status** and **priority** filters.
- Change a ticket's status and priority inline.
- Open any ticket, read its history and reply in the comment thread.

**General**
- Light / dark theme toggle.
- Responsive UI built with Tailwind CSS 4 and Lucide icons.
- Automatic activity logging for every key ticket action.
- Request logging (Morgan), secure HTTP headers (Helmet) and CORS restricted to the frontend origin.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 8, React Router 7, Axios, Tailwind CSS 4, Lucide React |
| Backend | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB (local or Atlas) |
| Auth | JSON Web Tokens in HttpOnly cookies, bcryptjs password hashing |
| Security / Tooling | Helmet, CORS, cookie-parser, Morgan, ESLint, Nodemon |

> `express-validator` and `express-rate-limit` are installed as dependencies but are not yet wired into the routes (see [Roadmap](#-known-limitations--roadmap)).

---

## 🏗 Architecture

```
┌─────────────────────┐   Axios (withCredentials)   ┌──────────────────────────┐
│  React SPA (Vite)   │ ──────────────────────────▶ │  Express API  :5000      │
│  localhost:5173     │ ◀────── JSON + cookie ───── │  /api/auth               │
│                     │                             │  /api/tickets            │
│  AuthContext        │                             │  /api/comments           │
│  ThemeContext       │                             │                          │
└─────────────────────┘                             │  protect → adminOnly     │
                                                    │  controllers → events    │
                                                    └────────────┬─────────────┘
                                                                 │ Mongoose
                                                    ┌────────────▼─────────────┐
                                                    │ MongoDB                  │
                                                    │ users · tickets ·        │
                                                    │ comments · activitylogs  │
                                                    └──────────────────────────┘
```

**Request flow:** the browser sends the JWT cookie automatically → `protect` middleware verifies it and loads the user → optional `adminOnly` guard → controller performs the operation → controller emits a domain event → the event listener writes an `ActivityLog` entry.

---

## 📁 Project Structure

```
support-ticket-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # register, login, logout, getMe
│   │   ├── ticketController.js    # CRUD, listing, activity, stats
│   │   └── commentController.js   # add / list comments
│   ├── events/
│   │   ├── eventNames.js          # event name constants
│   │   └── ticketEvents.js        # async emitter + activity-log listeners
│   ├── middleware/
│   │   └── authMiddleware.js      # protect, adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   ├── Comment.js
│   │   └── ActivityLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ticketRoutes.js
│   │   └── commentRoutes.js
│   ├── server.js                  # app entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── context/               # AuthContext, ThemeContext, ThemeToggle
│   │   ├── pages/                 # Login, Register, UserDashboard,
│   │   │                          # AdminDashboard, TicketDetails
│   │   ├── services/api.js        # Axios instance
│   │   ├── App.jsx                # routes & role-based redirects
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or newer (20+ recommended) and **npm**
- A **MongoDB** instance: local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd support-ticket-management-system
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `backend/.env` file (see [Environment Variables](#-environment-variables)), then start the API:

```bash
npm run dev      # development with auto-reload (nodemon)
# or
npm start        # plain node
```

The API runs at **http://localhost:5000**. Visiting `/` returns `{"message": "Support Ticket API is running"}`.

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:5173**.

> ⚠️ The frontend origin (`http://localhost:5173`) and the API URL (`http://localhost:5000/api`) are currently **hard-coded** in `backend/server.js` (CORS) and `frontend/src/services/api.js`. Keep these ports, or update both files together.

### 4. Try it out

1. Register an account at `/register` and log in — you land on the **user dashboard**.
2. Create a ticket and open it to add comments.
3. [Promote a user to admin](#-creating-an-admin-user) and log in again to see the **admin dashboard**.

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://127.0.0.1:27017/support-tickets
# or Atlas:
# MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/support-tickets

# Auth
JWT_SECRET=replace_with_a_long_random_string
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB connection string. The server exits if it cannot connect. |
| `JWT_SECRET` | ✅ | Secret used to sign JWTs (tokens expire after 1 day). Use a long random value. |
| `PORT` | ❌ | API port. Defaults to `5000`. |
| `NODE_ENV` | ❌ | When `production`, the auth cookie is sent with the `Secure` flag (HTTPS only). |

Generate a strong secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`.env` files are git-ignored — never commit real credentials.

---

## 👑 Creating an Admin User

Public registration always creates a user with the role `user`; there is no API to self-assign admin. To create an admin:

1. Register a normal account through the UI.
2. Change its role directly in MongoDB.

**Using `mongosh`:**

```js
use support-tickets
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**Using MongoDB Compass / Atlas:** open the `users` collection, edit the document and set `role` to `"admin"`.

Log out and log in again; the root route (`/`) will now render the admin dashboard.

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api`

Authentication uses an **HttpOnly cookie** named `token`, set on login. Clients must send credentials (`withCredentials: true` in Axios, `credentials: "include"` in fetch). Endpoints marked 🔒 require a valid cookie; 👑 additionally require the admin role.

### Authentication — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Create a new user account |
| POST | `/login` | Public | Log in and set the auth cookie |
| POST | `/logout` | 🔒 | Clear the auth cookie |
| GET | `/me` | 🔒 | Return the currently authenticated user |

**Register** — `POST /api/auth/register`
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```
`201 Created`
```json
{
  "message": "Registration successful",
  "user": { "id": "…", "name": "Jane Doe", "email": "jane@example.com", "role": "user" }
}
```
Errors: `400` missing fields · `409` email already registered.

**Login** — `POST /api/auth/login`
```json
{ "email": "jane@example.com", "password": "secret123" }
```
`200 OK` — sets the `token` cookie (HttpOnly, SameSite=Lax, 24 h) and returns the user object. Errors: `400` missing fields · `401` invalid credentials.

### Tickets — `/api/tickets`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | 🔒 | Create a ticket |
| GET | `/my-tickets` | 🔒 | List the current user's tickets (newest first) |
| GET | `/` | 🔒👑 | List all tickets with filtering, search, sorting and pagination |
| GET | `/stats` | 🔒👑 | Dashboard statistics |
| GET | `/:id` | 🔒 owner / admin | Get a single ticket |
| PUT | `/:id` | 🔒 owner / admin | Update a ticket (rules below) |
| DELETE | `/:id` | 🔒 owner | Delete an `open` ticket |
| GET | `/:id/activity` | 🔒 owner / admin | Get the ticket's activity timeline |

**Create** — `POST /api/tickets`
```json
{
  "title": "Cannot reset my password",
  "description": "The reset email never arrives.",
  "category": "Account",
  "priority": "high"
}
```
`title`, `description` and `category` are required. `priority` defaults to `medium`.

**List all tickets (admin)** — `GET /api/tickets`

| Query param | Default | Description |
|-------------|---------|-------------|
| `page` | `1` | Page number |
| `limit` | `10` | Page size (max `100`) |
| `status` | — | `open`, `in-progress` or `resolved` |
| `priority` | — | `low`, `medium` or `high` |
| `category` | — | Exact category match |
| `search` | — | Case-insensitive match on title, description or category |
| `sortBy` | `createdAt` | `createdAt` or `title` |
| `order` | `desc` | `asc` or `desc` |

Example: `GET /api/tickets?status=open&priority=high&search=password&page=1&limit=10`

```json
{
  "success": true,
  "pagination": { "currentPage": 1, "totalPages": 3, "totalTickets": 24, "limit": 10 },
  "tickets": [ { "_id": "…", "title": "…", "createdBy": { "name": "…", "email": "…" } } ]
}
```

**Update rules** — `PUT /api/tickets/:id`

| Actor | Allowed fields | Restrictions |
|-------|----------------|--------------|
| Admin | `title`, `description`, `category`, `priority`, `status` | None |
| Owner | `title`, `description`, `category` | Ticket must be `open`; cannot change `status` or `priority` |

**Dashboard stats** — `GET /api/tickets/stats`
```json
{
  "success": true,
  "overview": { "totalTickets": 42, "openTickets": 15, "inProgressTickets": 12, "resolvedTickets": 15 },
  "statusStats":   [ { "_id": "open", "count": 15 } ],
  "priorityStats": [ { "_id": "high", "count": 9 } ],
  "lastSevenDays": [ { "_id": "2026-11-24", "count": 5 } ]
}
```

### Comments — `/api/comments`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/:ticketId` | 🔒 owner / admin | Add a comment to a ticket |
| GET | `/:ticketId` | 🔒 owner / admin | List a ticket's comments (oldest first) |

**Add comment** — `POST /api/comments/:ticketId`
```json
{ "message": "Any update on this?" }
```

### Common error responses

| Status | Meaning |
|--------|---------|
| `400` | Missing/invalid input, or action not allowed for the ticket's current state |
| `401` | Not logged in, invalid/expired token, or bad credentials |
| `403` | Authenticated but not allowed (not the owner, or not an admin) |
| `404` | Resource not found |
| `409` | Duplicate resource (email already registered) |
| `500` | Unexpected server error |

Errors are returned as `{ "message": "…" }`.

---

## 🗄 Data Models

### User
| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, lowercased |
| `password` | String | Required, stored as a bcrypt hash |
| `role` | String | `user` (default) or `admin` |
| `createdAt` / `updatedAt` | Date | Automatic |

### Ticket
| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Required, trimmed |
| `description` | String | Required |
| `category` | String | Required, free text |
| `priority` | String | `low`, `medium` (default), `high` |
| `status` | String | `open` (default), `in-progress`, `resolved` |
| `createdBy` | ObjectId → User | Required |
| `createdAt` / `updatedAt` | Date | Automatic |

### Comment
| Field | Type | Notes |
|-------|------|-------|
| `ticket` | ObjectId → Ticket | Required |
| `user` | ObjectId → User | Required |
| `message` | String | Required, trimmed |

### ActivityLog
| Field | Type | Notes |
|-------|------|-------|
| `ticket` | ObjectId → Ticket | Required |
| `performedBy` | ObjectId → User | Required |
| `action` | String | `ticket_created`, `ticket_updated`, `status_changed`, `comment_added`, `ticket_resolved` |
| `details` | String | Human-readable description |

**Relationships:** a User has many Tickets; a Ticket has many Comments and ActivityLog entries.

---

## 🛡 Roles & Permissions

| Capability | User | Admin |
|------------|:----:|:-----:|
| Register / log in / log out | ✅ | ✅ |
| Create tickets | ✅ | ✅ |
| View own tickets | ✅ | ✅ |
| View **all** tickets, search & filter | ❌ | ✅ |
| View any ticket's details, comments & activity | Own only | ✅ |
| Edit title / description / category | Own, while `open` | ✅ Any |
| Change status & priority | ❌ | ✅ |
| Comment on a ticket | Own only | ✅ Any |
| Delete a ticket | Own, while `open` | ❌ (not implemented) |
| Dashboard statistics | ❌ | ✅ |

---

## ⚡ Event-Driven Activity Log

Instead of writing audit entries inside every controller, the backend uses a small **async event emitter** (`backend/events/ticketEvents.js`). Controllers emit a named event; listeners persist an `ActivityLog` document.

| Event | Emitted when | Logged action |
|-------|--------------|---------------|
| `ticketCreated` | A ticket is created | `ticket_created` |
| `ticketUpdated` | A ticket is updated | `ticket_updated` |
| `statusChanged` | Status differs after an update | `status_changed` ("Status changed from *x* to *y*") |
| `ticketResolved` | Status becomes `resolved` | `ticket_resolved` |
| `commentAdded` | A comment is posted | `comment_added` |

`emitAsync` awaits all listeners with `Promise.all`, so the log is written before the HTTP response is returned. To add a new behaviour (e.g. email notifications), register another listener for the relevant event — no controller changes are needed.

---

## 🖥 Frontend Overview

| Route | Component | Access |
|-------|-----------|--------|
| `/login` | `Login` | Public (redirects home if logged in) |
| `/register` | `Register` | Public (redirects home if logged in) |
| `/` | `UserDashboard` or `AdminDashboard` | Authenticated; chosen by `user.role` |
| `/tickets/:id` | `TicketDetails` | Authenticated |
| `*` | — | Redirects to `/` |

**State management**
- `AuthContext` — checks `/auth/me` on load, exposes `user`, `loading`, `login`, `register`, `logout`.
- `ThemeContext` — light/dark mode, toggled via `ThemeToggle`.

**API client** — `src/services/api.js` is a pre-configured Axios instance (`baseURL: http://localhost:5000/api`, `withCredentials: true`).

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (10 salt rounds) and never returned by the API.
- JWTs live in **HttpOnly** cookies (not accessible from JavaScript), `SameSite=Lax`, and `Secure` when `NODE_ENV=production`.
- **Helmet** sets secure HTTP headers; **CORS** only allows the frontend origin with credentials.
- Ownership checks are enforced server-side on every ticket and comment route.
- Sorting is restricted to an allow-list of fields.
- Pagination `limit` is capped at 100.

**Before deploying to production**
- Serve over HTTPS and set `NODE_ENV=production`.
- Move the hard-coded CORS origin and API base URL into environment variables.
- Use a long, random `JWT_SECRET` and keep `.env` out of version control.
- Add input validation and rate limiting (see below).

---

## 🧭 Known Limitations & Roadmap

Current limitations, noted for transparency:

- No dedicated "create admin" flow — admins are promoted manually in the database.
- `express-validator` and `express-rate-limit` are installed but not yet applied; login/register are not rate-limited and input validation is minimal (no password-strength or email-format checks).
- Ticket `category` is free text rather than a fixed list.
- Raw error messages are returned on `500` responses; consider a centralized error handler.
- The admin search uses an unescaped regular expression; escaping user input would harden it.
- Admins cannot delete tickets, and there is no pagination on the user's own ticket list.
- No automated tests yet (`npm test` is a placeholder).
- Hard-coded `localhost` URLs in `server.js` and `api.js`.
- `backend/config/db.js` forces DNS servers to `1.1.1.1` / `8.8.8.8`, which helps with Atlas SRV lookups on some networks but may not suit every environment.

Ideas for future work:

- [ ] Ticket assignment to specific support agents
- [ ] Email / in-app notifications driven by the existing event system
- [ ] File attachments on tickets and comments
- [ ] Charts for the admin statistics endpoint
- [ ] SLA timers and due dates
- [ ] Unit and integration tests (Jest + Supertest) and CI
- [ ] Docker / Docker Compose setup
- [ ] Swagger / OpenAPI documentation

---

## 📜 Scripts

**Backend** (`/backend`)

| Command | Description |
|---------|-------------|
| `npm start` | Run the API with Node |
| `npm run dev` | Run the API with Nodemon (auto-reload) |

**Frontend** (`/frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the code with ESLint |

---

## 🤝 Contributing

1. Fork the repository and create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes with clear messages.
3. Push the branch and open a Pull Request.

## 📄 License

The backend `package.json` declares the **ISC** license. Add a `LICENSE` file to the repository root to make this explicit.

## 👤 Author

**Hariom Mishra**
