# ARJUNA TMS — Backend

Node.js + Express + MongoDB (Mongoose) + JWT REST API for the ARJUNA Transport
Management System.

> This backend is designed to run **outside** the Lovable preview sandbox
> (which has no MongoDB). Run it locally or on any Node host.

## Stack
- Express 4 (REST API)
- MongoDB + Mongoose 8 (data layer)
- JWT auth (`jsonwebtoken`) + `bcryptjs` password hashing
- Centralized Role-Based Access Control (RBAC)

## Models
`User`, `Vehicle`, `Driver`, `Trip`, `Maintenance`, `FuelLog`, `Expense`,
`Notification`, `VehicleDocument`.

## Roles
`fleet_manager`, `dispatcher`, `safety_officer`, `financial_analyst`.
Permission matrix lives in `src/config/permissions.js` (mirrored on the
frontend at `frontend/src/config/permissions.ts`).

## Getting started
```bash
cd backend
cp .env.example .env      # then edit MONGO_URI + JWT_SECRET
npm install
npm run seed              # optional: demo users, vehicles, drivers...
npm run dev               # http://localhost:5000
```

### Seeded demo logins (all password: `Password123!`)
| Role              | Email                     |
|-------------------|---------------------------|
| Fleet Manager     | manager@arjuna.com        |
| Dispatcher        | dispatcher@arjuna.com     |
| Safety Officer    | safety@arjuna.com         |
| Financial Analyst | finance@arjuna.com        |

## API surface
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET/POST/PUT/DELETE  /api/vehicles
GET/POST/PUT/DELETE  /api/drivers
GET/POST/PUT/DELETE  /api/trips
GET/POST/PUT/DELETE  /api/maintenance
GET/POST/PUT/DELETE  /api/fuel-logs
GET/POST/PUT/DELETE  /api/expenses
GET/POST/PUT/DELETE  /api/documents
GET/PUT              /api/notifications
GET                  /api/search?q=...
```
Every non-auth route is protected by JWT + RBAC middleware.