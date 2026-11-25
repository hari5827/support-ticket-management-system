# Database Design – Support Ticket Management System

## 1. Database Overview

The application uses MongoDB as its database and Mongoose as the ODM (Object Data Modeling) library.

The database is organised into four main collections:

1. Users
2. Tickets
3. Comments
4. ActivityLogs

## 2. Collections and Their Fields

### Users Collection

Stores registered users and administrators.

| Field | Description |
|---|---|
| _id | Unique user identifier |
| name | User's name |
| email | User's email address |
| password | Hashed password |
| role | User role (user/admin) |
| createdAt | Account creation timestamp |
| updatedAt | Last update timestamp |

### Tickets Collection

Stores support tickets created by users.

| Field | Description |
|---|---|
| _id | Unique ticket identifier |
| title | Ticket title |
| description | Ticket description |
| category | Ticket category |
| priority | Low, Medium or High |
| status | Open, In Progress or Resolved |
| createdBy | Reference to the Users collection |
| createdAt | Ticket creation timestamp |
| updatedAt | Last update timestamp |

### Comments Collection

Stores comments added to support tickets.

| Field | Description |
|---|---|
| _id | Unique comment identifier |
| ticket | Reference to the Tickets collection |
| user | Reference to the Users collection |
| message | Comment content |
| createdAt | Comment creation timestamp |
| updatedAt | Last update timestamp |

### ActivityLogs Collection

Maintains a history of actions performed on tickets.

| Field | Description |
|---|---|
| _id | Unique activity identifier |
| ticket | Reference to the Tickets collection |
| performedBy | Reference to the Users collection |
| action | Type of action performed |
| details | Additional activity information |
| createdAt | Activity timestamp |

Supported activity types include ticket creation, ticket updates, status changes, comments and ticket resolution.

## 3. Relationships Between Collections

- One user can create multiple tickets.
- One ticket belongs to one user through the `createdBy` reference.
- One ticket can have multiple comments.
- Each comment is associated with one ticket and one user.
- One ticket can have multiple activity log entries.
- Each activity log records the user who performed the action.

MongoDB ObjectId references are used to connect related documents.

## 4. Design Decisions

- Separate collections are used to keep user, ticket, comment and activity data organised.
- Passwords are hashed before being stored.
- Mongoose references connect related documents.
- Timestamps help track when records are created and updated.
- Activity logs maintain a history of important ticket operations.

## 5. Database Technology

- Database: MongoDB
- ODM: Mongoose
- Data format: BSON documents
- Relationships: ObjectId references