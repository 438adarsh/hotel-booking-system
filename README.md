# Hotel Booking System (StayEase)

A full-stack hotel booking system built for a university project. Users can register, log in, browse and search rooms, book stays, and manage their bookings. Admins can manage rooms, bookings, and users through a dashboard.

The code is written in a simple, beginner-friendly style with comments explaining every major section.

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Frontend     | React, React Router, Tailwind CSS  |
| Backend      | Node.js, Express.js                 |
| Database     | MongoDB with Mongoose               |
| Auth         | JWT (JSON Web Tokens) + bcryptjs    |
| State        | React Context API (no Redux)        |

---

## Features

### User
- Register and Login (JWT-based)
- View profile
- Browse all rooms
- View a room's details
- Search rooms by name or room type
- Filter rooms by price, capacity, and room type
- Sort rooms by lowest price, highest price, or name
- Book a room (pick check-in and check-out dates)
- View "My Bookings" (upcoming, completed, cancelled)
- Cancel a booking

### Admin
- Admin dashboard with summary cards (total users, rooms, bookings, available rooms)
- Create, edit, and delete rooms
- View all bookings
- Update booking status (pending, confirmed, cancelled, completed)
- View all users
- Change a user's role
- Delete a user

### Other
- Role-based access control (admin routes are protected)
- Friendly error messages and form validation
- Responsive layout (mobile + desktop)
- Seed data: 1 admin account + 8 sample rooms

---

## Folder Structure

```
hotel-booking-system/
│
├── client/                  <-- This repository root (React frontend)
│   ├── src/
│   │   ├── components/       Reusable UI pieces (Navbar, RoomCard, etc.)
│   │   ├── pages/           One file per page
│   │   │   └── admin/       Admin-only pages
│   │   ├── context/         React Context providers (Auth, Toast)
│   │   ├── services/        API calls (api.ts)
│   │   ├── types.ts         Shared TypeScript types
│   │   ├── App.tsx          Routes
│   │   └── main.tsx         App entry point
│   ├── package.json
│   └── vite.config.ts
│
└── server/                  <-- Express + MongoDB backend
    ├── config/
    │   ├── db.js            MongoDB connection
    │   └── seed.js          Seeds admin user + sample rooms
    ├── controllers/         Route logic (auth, rooms, bookings, admin)
    ├── middleware/          auth, admin, error handler
    ├── models/              Mongoose models (User, Room, Booking)
    ├── routes/              Express route definitions
    ├── server.js            Entry point
    ├── package.json
    └── .env.example         Copy to .env and fill in values
```

> Note: In this project the `client/` folder is the repository root. The `server/` folder sits inside it.

---

## Prerequisites

1. **Node.js** (v18 or newer) — https://nodejs.org
2. **MongoDB** — either:
   - A local MongoDB instance running on `mongodb://127.0.0.1:27017`, or
   - A free cloud cluster from MongoDB Atlas (https://www.mongodb.com/cloud/atlas)

---

## Installation & Running

### 1. Start the backend (server)

```bash
cd server
npm install
cp .env.example .env      # then edit .env and set MONGO_URI + JWT_SECRET
npm run seed              # creates the admin user + 8 sample rooms
npm start
```

The API will run on **http://localhost:5000**.

### 2. Start the frontend (client)

Open a **new terminal** and run, from the project root:

```bash
npm install
npm start
```

The website will open on **http://localhost:5173** (Vite's default port).

> The frontend calls the backend at `http://localhost:5000/api`, so make sure the server is running first.

---

## Seed Data

Running `npm run seed` in the `server/` folder creates:

**Admin account**
- Email: `admin@gmail.com`
- Password: `admin123`

**8 sample rooms** with different room types (Standard, Deluxe, Suite, Family) and prices ranging from $80 to $500 per night.

---

## API Endpoints

All endpoints are prefixed with `/api`.

### Auth
| Method | Endpoint             | Description              | Access      |
| ------ | -------------------- | ------------------------ | ----------- |
| POST   | `/api/auth/register` | Register a new user      | Public      |
| POST   | `/api/auth/login`    | Log in                   | Public      |
| GET    | `/api/auth/me`        | Get logged-in user info  | Logged in   |

### Rooms
| Method | Endpoint             | Description                          | Access      |
| ------ | -------------------- | ------------------------------------ | ----------- |
| GET    | `/api/rooms`         | List rooms (search, filter, sort)    | Public      |
| GET    | `/api/rooms/:id`     | Get one room                         | Public      |
| POST   | `/api/rooms`         | Create a room                        | Admin       |
| PUT    | `/api/rooms/:id`     | Update a room                        | Admin       |
| DELETE | `/api/rooms/:id`     | Delete a room                        | Admin       |

### Bookings
| Method | Endpoint                    | Description                | Access      |
| ------ | --------------------------- | -------------------------- | ----------- |
| POST   | `/api/bookings`             | Create a booking           | Logged in   |
| GET    | `/api/bookings/my`           | Get my bookings            | Logged in   |
| GET    | `/api/bookings`              | Get all bookings           | Admin       |
| PUT    | `/api/bookings/:id/status`  | Update booking status      | Admin       |
| PUT    | `/api/bookings/:id/cancel`   | Cancel own booking         | Logged in   |

### Admin
| Method | Endpoint                 | Description                | Access |
| ------ | ------------------------ | -------------------------- | ------ |
| GET    | `/api/admin/dashboard`   | Dashboard summary stats    | Admin  |
| GET    | `/api/admin/users`        | List all users             | Admin  |
| PUT    | `/api/admin/users/:id`    | Update a user (name/role)  | Admin  |
| DELETE | `/api/admin/users/:id`    | Delete a user             | Admin  |

---

## Query Parameters for `GET /api/rooms`

| Param      | Example        | Description                          |
| ---------- | -------------- | ------------------------------------ |
| `search`   | `?search=deluxe` | Search by room name or type        |
| `roomType` | `?roomType=Suite` | Filter by room type               |
| `maxPrice` | `?maxPrice=200`  | Rooms up to this price per night  |
| `capacity` | `?capacity=4`    | Rooms that fit at least N guests  |
| `sort`     | `?sort=price_low` | `price_low`, `price_high`, or `name` |

Example: `GET /api/rooms?search=suite&roomType=Suite&maxPrice=400&sort=price_low`

---

## Authentication Flow

1. User registers or logs in. The server returns a **JWT token**.
2. The frontend saves the token in `localStorage`.
3. For protected requests, the token is sent in the `Authorization: Bearer <token>` header.
4. The `protect` middleware verifies the token and attaches the user to the request.
5. The `admin` middleware checks that the user's role is `admin`.

Passwords are hashed with **bcrypt** before being stored in MongoDB.

---

## Frontend Pages

| Route                 | Page              | Access       |
| --------------------- | ----------------- | ------------ |
| `/`                   | Home              | Public       |
| `/login`              | Login             | Public       |
| `/register`           | Register          | Public       |
| `/rooms`              | Rooms list        | Public       |
| `/rooms/:id`          | Room details      | Public       |
| `/book/:id`           | Booking page      | Logged in    |
| `/my-bookings`        | My bookings       | Logged in    |
| `/profile`            | Profile           | Logged in    |
| `/admin/dashboard`    | Admin dashboard   | Admin        |
| `/admin/rooms`        | Manage rooms      | Admin        |
| `/admin/bookings`     | Manage bookings   | Admin        |
| `/admin/users`        | Manage users      | Admin        |
| `*`                   | 404 page          | Public       |

---

## Project Requirements Checklist

- [x] React Frontend
- [x] Node.js Backend
- [x] MongoDB Database
- [x] REST APIs
- [x] Authentication (JWT + bcrypt)
- [x] Role Based Access (admin / user)
- [x] Search (by name or room type)
- [x] Filtering (by price, capacity, room type)
- [x] Sorting (lowest price, highest price, name)
- [x] Dashboard (admin + user summary cards)
- [x] CRUD Operations (rooms, bookings, users)
- [x] Documentation (README)

No Docker, no deployment, no testing — as specified.
