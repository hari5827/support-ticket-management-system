<div align="center">

# 🎫 Support Ticket Management System

**A full-stack help-desk platform for raising, tracking and resolving support tickets.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://support-ticket-management-system-topaz.vercel.app/login)
[![API](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://support-ticket-management-system-xazj.onrender.com/)

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20HttpOnly%20Cookies-F59E0B?style=flat-square)

</div>

---

## 📖 Overview

Users raise support tickets, track their progress and communicate with the support team. Admins manage, filter, update and resolve tickets through a dedicated dashboard with live statistics.

The project is built on the **MERN stack** and features cookie-based JWT authentication, role-based access control, and an event-driven activity log.

| | Link |
|---|---|
| 🌐 **Live Application** | https://support-ticket-management-system-topaz.vercel.app/login |
| ⚙️ **Backend API** | https://support-ticket-management-system-xazj.onrender.com/ |

---

## 📑 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Architecture](#-architecture)
4. [Project Structure](#-project-structure)
5. [Getting Started](#-getting-started)
6. [Environment Variables](#-environment-variables)
7. [Admin Registration](#-admin-registration)
8. [API Reference](#-api-reference)
9. [Data Models](#-data-models)
10. [Roles & Permissions](#-roles--permissions)
11. [Event-Driven Activity Log](#-event-driven-activity-log)
12. [Frontend Overview](#-frontend-overview)
13. [Security Notes](#-security-notes)
14. [Known Limitations & Roadmap](#-known-limitations--roadmap)
15. [Scripts](#-scripts)
16. [Author](#-author)

---

## ✨ Features

### 👤 For Users
- Register, log in and log out securely using HttpOnly cookie authentication
- Create support tickets with a title, description, category and priority
- View and track their own tickets, and filter them by status
- Edit or delete tickets while they are still **open**
- View ticket details, comments and activity history
- Add comments to their tickets

### 🛠️ For Admins
- Dedicated admin registration and login
- Dashboard with total, open, in-progress and resolved ticket statistics
- Statistics by status, by priority, and tickets created over the last seven days
- View tickets submitted by all users
- Search, filter, sort and paginate tickets
- Update ticket status and priority
- View ticket history and respond through comments

### 🌐 General
- Light and dark themes
- Responsive UI built with Tailwind CSS
- Automatic activity logging for important ticket actions
- Secure HTTP headers (Helmet) and request logging (Morgan)
- Role-based access control

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, React Router, Axios |
| **Styling** | Tailwind CSS, Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, HttpOnly Cookies, bcryptjs |
| **Security** | Helmet, CORS |
| **Development** | Nodemon, ESLint |

---

## 🏗️ Architecture

```text
React Frontend
      │
      │  Axios (withCredentials)
      ▼
Express REST API
      ├── Authentication Middleware
      ├── Role-Based Access Control
      ├── Controllers
      └── Event Emitter
      │
      ▼
MongoDB Database
      ├── Users
      ├── Tickets
      ├── Comments
      └── ActivityLogs
```

**Request flow:** The browser sends the JWT cookie with each API request. The authentication middleware verifies the token and identifies the user. The controller performs the requested operation and emits the relevant events. Event listeners then create activity log entries.

---

## 📁 Project Structure

```text
support-ticket-management-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ticketController.js
│   │   └── commentController.js
│   ├── events/
│   │   ├── eventNames.js
│   │   └── ticketEvents.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   ├── Comment.js
│   │   └── ActivityLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ticketRoutes.js
│   │   └── commentRoutes.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or newer (20+ recommended)
- **npm**
- **MongoDB**: a local installation or a MongoDB Atlas account

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

Create a `.env` file inside the `backend` folder (see [Environment Variables](#-environment-variables)), then start the server:

```bash
npm run dev     # development, with auto-reload
# or
npm start       # production-style start
```

The backend runs at **http://localhost:5000**.

### 3. Set up the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at **http://localhost:5173**.

### 4. Try the application

1. Register a normal user at `/register`.
2. Log in and create a support ticket.
3. Register an admin at `/admin/register` using the admin setup code.
4. Log in at `/admin/login`.
5. Manage tickets from the admin dashboard.

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/support-tickets

JWT_SECRET=replace_with_a_long_random_string

ADMIN_SETUP_CODE= **TicketFlowAdmin2027**
```

| Variable | Required | Description |
|---|:---:|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret used to sign JWT tokens |
| `ADMIN_SETUP_CODE` | ✅ | Secret code required for admin registration |
| `PORT` | ❌ | Backend port (defaults to `5000`) |
| `NODE_ENV` | ❌ | Controls production cookie settings |

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> [!IMPORTANT]
> - Never commit your actual `.env` file.
> - Never expose `JWT_SECRET` or `ADMIN_SETUP_CODE` in frontend code.
> - Configure these variables separately in your deployment environment.
> - Use different secret values for local development and production.

---

## 🛡️ Admin Registration

The application provides separate authentication flows for normal users and administrators.

| Purpose | Route |
|---|---|
| User Registration | `/register` |
| User Login | `/login` |
| Admin Registration | `/admin/register` |
| Admin Login | `/admin/login` |

### How it works

Admin registration is protected by a secret setup code stored in a backend environment variable:

```env
ADMIN_SETUP_CODE= TicketFlowAdmin2027
```

When an admin registers, the backend verifies the submitted setup code against this variable. Only users who provide the correct code can create an admin account.

### Testing admin access (for recruiters and evaluators)

1. Open the live application.
2. Go to the [admin registration page](https://support-ticket-management-system-topaz.vercel.app/admin/register).
3. Enter your name, email, password and the admin setup code.
4. Register, then sign in at `/admin/login`.
5. Use the admin dashboard to manage support tickets.


---

## 📡 API Reference

| Environment | Base URL |
|---|---|
| Local | `http://localhost:5000/api` |
| Production | `https://support-ticket-management-system-xazj.onrender.com/api` |

Authentication uses an **HttpOnly cookie** named `token`. API clients must send credentials with each request.

### Authentication: `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register a normal user |
| `POST` | `/login` | Public | User login |
| `POST` | `/admin/register` | Setup code | Register an admin |
| `POST` | `/admin/login` | Public | Admin login |
| `POST` | `/logout` | Authenticated | Log out |
| `GET` | `/me` | Authenticated | Get the current user |

<details>
<summary><b>Example: user registration</b></summary>

`POST /api/auth/register`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

Normal registration always creates an account with the `user` role.
</details>

<details>
<summary><b>Example: admin registration</b></summary>

`POST /api/auth/admin/register`

```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "secret123",
  "setupCode": "your_private_setup_code"
}
```

The backend validates the setup code before creating the admin account.
</details>

### Tickets: `/api/tickets`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | Authenticated | Create a ticket |
| `GET` | `/my-tickets` | User | List own tickets |
| `GET` | `/` | Admin | List all tickets |
| `GET` | `/stats` | Admin | Dashboard statistics |
| `GET` | `/:id` | Owner / Admin | Get ticket details |
| `PUT` | `/:id` | Owner / Admin | Update a ticket |
| `DELETE` | `/:id` | Owner | Delete an open ticket |
| `GET` | `/:id/activity` | Owner / Admin | Get activity history |

<details>
<summary><b>Example: create a ticket</b></summary>

`POST /api/tickets`

```json
{
  "title": "Internet Issue",
  "description": "Internet is not working",
  "category": "Technical",
  "priority": "high"
}
```
</details>

#### Admin ticket filtering

`GET /api/tickets` supports the following query parameters:

| Parameter | Description |
|---|---|
| `page` | Page number |
| `limit` | Number of tickets per page |
| `status` | Filter by ticket status |
| `priority` | Filter by priority |
| `category` | Filter by category |
| `search` | Search title, description or category |
| `sortBy` | Sort by `createdAt` or `title` |
| `order` | `asc` or `desc` |

Example:

```text
/api/tickets?status=open&priority=high&page=1&limit=10
```

### Comments: `/api/comments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/:ticketId` | Owner / Admin | Add a comment |
| `GET` | `/:ticketId` | Owner / Admin | List comments |

```json
{
  "message": "Any update on this issue?"
}
```

---

## 🗄️ Data Models

### User

| Field | Type | Description |
|---|---|---|
| `name` | String | User name |
| `email` | String | Unique email |
| `password` | String | bcrypt password hash |
| `role` | String | `user` or `admin` |
| `timestamps` | Date | Created and updated dates |

### Ticket

| Field | Type | Description |
|---|---|---|
| `title` | String | Ticket title |
| `description` | String | Ticket details |
| `category` | String | Ticket category |
| `priority` | String | `low`, `medium` or `high` |
| `status` | String | `open`, `in-progress` or `resolved` |
| `createdBy` | ObjectId | Reference to User |
| `timestamps` | Date | Created and updated dates |

### Comment

| Field | Type | Description |
|---|---|---|
| `ticket` | ObjectId | Reference to Ticket |
| `user` | ObjectId | Reference to User |
| `message` | String | Comment content |

### ActivityLog

| Field | Type | Description |
|---|---|---|
| `ticket` | ObjectId | Reference to Ticket |
| `performedBy` | ObjectId | Reference to User |
| `action` | String | Activity type |
| `details` | String | Activity description |

**Relationships**

- A User can create many Tickets.
- A Ticket can have many Comments.
- A Ticket can have many ActivityLog entries.

---

## 🔑 Roles & Permissions

| Capability | User | Admin |
|---|:---:|:---:|
| Register and log in | ✅ | ✅ |
| Create tickets | ✅ | ✅ |
| View own tickets | ✅ | ✅ |
| View all tickets | ❌ | ✅ |
| Search and filter all tickets | ❌ | ✅ |
| Edit own open tickets | ✅ | ✅ |
| Change ticket status | ❌ | ✅ |
| Change ticket priority | ❌ | ✅ |
| Comment on tickets | Own only | Any |
| Delete tickets | Own open tickets | ❌ |
| Dashboard statistics | ❌ | ✅ |

---

## ⚡ Event-Driven Activity Log

The backend uses a custom asynchronous event emitter in `backend/events/ticketEvents.js`. Controllers emit events when important ticket operations occur, and event listeners save the corresponding records in the `ActivityLog` collection.

| Event | Trigger |
|---|---|
| `ticketCreated` | Ticket created |
| `ticketUpdated` | Ticket updated |
| `statusChanged` | Ticket status changed |
| `ticketResolved` | Ticket resolved |
| `commentAdded` | Comment added |

The asynchronous emitter waits for all listeners to finish before the HTTP response is returned. This design lets you add further listeners, such as email notifications, without placing that logic inside the controllers.

> [!NOTE]
> The current event emitter runs in memory. It does not provide persistent queues or automatic retries if the server crashes.

---

## 🖥️ Frontend Overview

| Route | Component | Description |
|---|---|---|
| `/login` | `Login` | User login |
| `/register` | `Register` | User registration |
| `/admin/login` | `AdminLogin` | Admin login |
| `/admin/register` | `AdminRegister` | Admin registration |
| `/` | `UserDashboard` / `AdminDashboard` | Role-based dashboard |
| `/tickets/:id` | `TicketDetails` | Ticket details, comments and activity |

### State management

- **AuthContext**: handles authentication, the current user and logout
- **ThemeContext**: handles light and dark themes
- **Axios API client**: sends API requests with credentials

---

## 🔒 Security Notes

- Passwords are hashed with bcryptjs.
- JWT tokens are stored in HttpOnly cookies.
- Admin registration requires a server-side setup code.
- User roles are enforced through backend middleware.
- Ticket ownership is verified on protected operations.
- Helmet adds secure HTTP headers.
- CORS is configured to allow the frontend origin.
- Pagination limits are capped.

---

## 🧭 Known Limitations & Roadmap

### Current limitations

- The event emitter is in-memory and does not provide durable message processing.
- Input validation and rate limiting can be expanded.
- Ticket categories accept free-text values.
- Automated backend tests are not yet implemented.
- There is no email notification system.
- Tickets cannot be assigned to individual support agents.
- The admin setup code is a shared registration secret, not an individual invitation system.

### Planned improvements

- [ ] Ticket assignment to support agents
- [ ] Email and in-app notifications
- [ ] File attachments
- [ ] More detailed analytics and charts
- [ ] SLA timers and due dates
- [ ] Automated tests using Jest and Supertest
- [ ] Docker and Docker Compose
- [ ] Swagger / OpenAPI documentation
- [ ] Durable event processing using a message queue

---

## 📜 Scripts

### Backend

| Command | Description |
|---|---|
| `npm start` | Start the backend |
| `npm run dev` | Start the backend with Nodemon |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## 👨‍💻 Author

**Hariom Mishra**

---

<div align="center">

⭐ If you found this project useful, consider giving it a star.

</div>
