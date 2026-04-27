# UrbanCrew Backend Migration — Walkthrough

## Summary

Successfully migrated the UrbanCrew platform from **React + Firebase** to a full **Node.js + Express + MongoDB** client-server architecture. The frontend UI remains completely unchanged — only the data-fetching logic was swapped from Firebase SDK calls to Axios REST API calls.

---

## Architecture

```mermaid
graph LR
    A["React Frontend<br/>:5173"] -->|"Axios + JWT"| B["Express API<br/>:5000"]
    A -->|"WebSocket"| C["Socket.io<br/>:5000"]
    B --> D["MongoDB Atlas"]
    B --> E["JWT Auth"]
    B --> F["Sessions/Cookies"]
    C --> D
```

---

## Backend Structure

```
backend/
├── server.js                          # Express + Socket.io + EJS entry point
├── seed.js                            # Admin seeding script (bcrypt + env vars)
├── .env                               # Environment variables (Atlas URI, JWT, admin creds)
├── package.json                       # Backend dependencies
├── config/
│   └── db.js                          # MongoDB Atlas connection (with local fallback)
├── models/
│   ├── User.js                        # User schema (bcrypt pre-save hook)
│   ├── Client.js                      # Client organization details
│   ├── Worker.js                      # Worker skills, availability, status
│   ├── Request.js                     # Staffing request with status workflow
│   └── Assignment.js                  # Worker-client job assignment
├── controllers/
│   ├── authController.js              # Register, login, getMe, logout
│   ├── adminController.js             # Dashboard stats, workers, requests, assignments
│   ├── clientController.js            # Client dashboard, create/list requests
│   └── workerController.js            # Worker dashboard, job history, availability
├── routes/
│   ├── authRoutes.js                  # POST /register, /login | GET /me
│   ├── adminRoutes.js                 # Admin-only routes (7 endpoints)
│   ├── clientRoutes.js                # Client-only routes (3 endpoints)
│   └── workerRoutes.js                # Worker-only routes (3 endpoints)
├── middleware/
│   ├── authMiddleware.js              # JWT protect + role-based authorize
│   ├── errorMiddleware.js             # Global error handler (Mongoose, JWT, 404)
│   └── loggerMiddleware.js            # Custom request lifecycle logger
└── views/
    └── demo.ejs                       # SSR demo page with dynamic stats
```

---

## API Reference

### Auth Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register (client/worker), returns JWT |
| POST | `/api/auth/login` | Public | Login, returns JWT + user data |
| GET | `/api/auth/me` | Protected | Get current user profile |
| POST | `/api/auth/logout` | Protected | Clear cookie & session |

### Admin Routes (`/api/admin`) — Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Aggregate stats (clients, workers, requests) |
| GET | `/api/admin/requests` | All requests with client info |
| PUT | `/api/admin/requests/:id/status` | Update request status |
| GET | `/api/admin/workers` | All workers with user info |
| PUT | `/api/admin/approve-worker/:id` | Toggle worker active/inactive |
| POST | `/api/admin/assign-worker` | Create assignment + update availability |
| GET | `/api/admin/clients` | All clients |

### Client Routes (`/api/client`) — Client Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/client/dashboard` | Stats + recent 5 requests |
| POST | `/api/client/request` | Create new staffing request |
| GET | `/api/client/requests` | All requests for current client |

### Worker Routes (`/api/worker`) — Worker Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/worker/dashboard` | Current assignment + worker profile |
| GET | `/api/worker/jobs` | Full job history with duration calc |
| PUT | `/api/worker/availability` | Toggle availability |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/demo` | EJS server-side rendered page |

---

## Syllabus Requirements Coverage

| Requirement | Implementation |
|-------------|---------------|
| **Client-Server Architecture** | React (:5173) → Express API (:5000) → MongoDB Atlas |
| **Express.js** | [server.js](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/backend/server.js) with full middleware stack |
| **MongoDB + Mongoose** | 5 models in `backend/models/`, Atlas connection in [db.js](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/backend/config/db.js) |
| **JWT Authentication** | [authController.js](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/backend/controllers/authController.js) — register, login, token generation |
| **bcrypt Password Hashing** | [User.js](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/backend/models/User.js) — pre-save hook + matchPassword method |
| **Application-Level Middleware** | [loggerMiddleware.js](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/backend/middleware/loggerMiddleware.js), cors, helmet, morgan |
| **Router-Level Middleware** | `router.use(protect, authorize)` in all route files |
| **Error-Handling Middleware** | [errorMiddleware.js](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/backend/middleware/errorMiddleware.js) — Mongoose, JWT, 404 errors |
| **Third-Party Middleware** | `express.json()`, `cookie-parser`, `morgan`, `helmet`, `cors` |
| **REST APIs** | 17 endpoints across 4 route modules |
| **Sessions & Cookies** | `express-session` with `connect-mongo` store, cookie-based token |
| **EJS Template Engine** | [demo.ejs](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/backend/views/demo.ejs) — SSR at `GET /demo` |
| **Socket.io Real-Time** | Events: `newRequest`, `requestStatusUpdate`, `workerAssigned` |
| **Role-Based Access** | 3 roles (admin/client/worker) enforced by `authorize()` middleware |
| **Rate Limiting** | Auth routes limited to 10 requests per 15 min |
| **API Validation** | Input validation in all controllers |
| **Logging** | morgan + custom loggerMiddleware |

---

## Frontend Changes

### New Files
| File | Purpose |
|------|---------|
| [api.js](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/src/services/api.js) | Axios instance with JWT interceptor |
| [socket.js](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/src/services/socket.js) | Socket.io client connection |

### Modified Files (Firebase → API)
All 9 files below had their Firebase SDK imports removed and replaced with `import api from '../../services/api'`. The **UI/JSX remained identical** — only the data-fetching functions changed.

| File | What Changed |
|------|-------------|
| [AuthContext.jsx](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/src/contexts/AuthContext.jsx) | Firebase Auth → API calls, localStorage token, `/me` check on mount |
| [AdminDashboard.jsx](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/src/pages/dashboard/admin/AdminDashboard.jsx) | `getDocs` → `GET /api/admin/dashboard` |
| [RequestManagement.jsx](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/src/pages/dashboard/admin/RequestManagement.jsx) | `getDocs/updateDoc` → API calls |
| [WorkerManagement.jsx](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/src/pages/dashboard/admin/WorkerManagement.jsx) | `getDocs/addDoc/updateDoc` → API calls |
| [ClientDashboard.jsx](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/src/pages/dashboard/client/ClientDashboard.jsx) | `getDocs` → `GET /api/client/dashboard` |
| [CreateRequest.jsx](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/src/pages/dashboard/client/CreateRequest.jsx) | `addDoc` → `POST /api/client/request` |
| [WorkerDashboard.jsx](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/src/pages/dashboard/worker/WorkerDashboard.jsx) | `getDocs` → `GET /api/worker/dashboard` |
| [WorkerAvailability.jsx](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/src/pages/dashboard/worker/WorkerAvailability.jsx) | `getDoc/updateDoc` → API calls |
| [WorkerJobHistory.jsx](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/src/pages/dashboard/worker/WorkerJobHistory.jsx) | `getDocs/query/where` → `GET /api/worker/jobs` |

> [!NOTE]
> The original [firebase.js](file:///d:/Ksp%20Harsh/SEM-4/BEE/Urban_crew_BEE/src/services/firebase.js) file is preserved but no longer imported by any component.

---

## 🚀 How to Start

### Step 1: Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free cluster
2. Create a database user with password
3. Whitelist your IP (or use `0.0.0.0/0` for development)
4. Get your connection string
5. Edit `backend/.env` and update `MONGO_URI`:

```env
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/urbancrew?retryWrites=true&w=majority
```

### Step 2: Seed Admin Account

```bash
cd backend
node seed.js
```

Expected output:
```
✅ MongoDB Connected
✅ Admin account created successfully!
   │ Email:    admin@urbancrew.com
   │ Role:     admin
   │ Active:   true
🔒 Password has been securely hashed with bcrypt.
```

### Step 3: Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
🚀 UrbanCrew Backend Server
   ├── API:     http://localhost:5000/api
   ├── Health:  http://localhost:5000/api/health
   ├── Demo:    http://localhost:5000/demo
   ├── Socket:  ws://localhost:5000
   └── Mode:    development
```

### Step 4: Start Frontend

```bash
cd ..
npm run dev
```

Frontend runs at `http://localhost:5173`

### Step 5: Test the Flow

1. Open `http://localhost:5000/api/health` → verify API is running
2. Open `http://localhost:5000/demo` → see EJS SSR page
3. Open `http://localhost:5173` → React frontend
4. Register a client account → Login → Create a request
5. Login as admin (`admin@urbancrew.com` / `admin123`) → View dashboard

---

## Testing with Postman

### Register a Client
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "Test Client",
  "email": "client@test.com",
  "password": "test123",
  "phone": "9876543210",
  "role": "client",
  "organizationName": "Test School",
  "organizationType": "school",
  "location": "Mumbai"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "admin@urbancrew.com",
  "password": "admin123"
}
```
Copy the `token` from response.

### Access Protected Route
```
GET http://localhost:5000/api/admin/dashboard
Headers:
  Authorization: Bearer <paste-token-here>
```
