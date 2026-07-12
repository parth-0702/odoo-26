# Running ARJUNA TMS against real MongoDB

This documents what was fixed and the exact steps to get data actually
persisting to MongoDB (previously the app was silently running on in-memory
mock data, and the create/edit forms were unstyled).

## What was wrong

1. **No `.env` files existed** — only `.env.example`. Without
   `VITE_API_BASE_URL` set, the frontend's `USE_MOCKS` flag
   (`frontend/src/api/client.ts`) defaulted to `true`, so every "Create" /
   "Edit" / "Delete" action only mutated an in-memory array — nothing ever
   reached the backend or MongoDB, and it reset on every page refresh.
2. **Demo login couldn't authenticate against the real API.** The Login
   page is a role-switcher with no password field. It called
   `login("", "", role)`, which — once mocks are off — POSTs blank
   credentials to `/api/auth/login`, which always fails against real users.
3. **Optional dropdown/date fields broke writes.** In `ResourceForm.tsx`,
   an unselected `<select>` (e.g. "Linked Trip", "Vehicle", "Driver") or an
   empty date submitted as `""`. Mongoose can't cast `""` to `ObjectId` or
   `Date`, so `POST`/`PUT` requests threw a 500 CastError — this is why
   shipments/drivers/vehicles/trips would fail to save whenever an optional
   dropdown was left on "Select…" (exactly like the screenshot).
4. **The New/Edit modal form fields were unstyled** — thin, low-contrast
   borders left over from before the redesign, inconsistent with the rest
   of the app.

## What was fixed

- Added `backend/.env` and `frontend/.env` with working local defaults.
- Added `frontend/src/config/demoAuth.ts` mapping each role to its seeded
  demo account (`admin@arjuna.com` / `manager@arjuna.com` /
  `driver@arjuna.com` / `staff@arjuna.com`, all `Password123!`), and wired
  `authService.login` to use them automatically when the role-switcher is
  used against the real API.
- `ResourceForm.tsx` now strips empty-string values before submit, so
  unselected optional fields are omitted instead of sent as `""`.
- `ResourceForm.tsx` inputs restyled to match the app's Memphis/Bento
  design system (thick borders, rounded, clear focus state).

## How to run it for real

**1. Start MongoDB** (pick one):
- Local: install MongoDB Community Server and run `mongod`
- Or use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and
  copy its connection string

**2. Configure the backend**

`backend/.env` already has a working local default:
```
MONGO_URI=mongodb://127.0.0.1:27017/arjuna_tms
```
If you're using Atlas, replace it with your `mongodb+srv://...` string.

**3. Install, seed, and start the backend**
```bash
cd backend
npm install
npm run seed   # creates the 4 demo users + sample fleet data
npm run dev    # starts the API on :5000
```
You should see `✔ MongoDB connected: ...` in the console.

**4. Install and start the frontend**
```bash
cd frontend
npm install
npm run dev    # starts on :5173
```

**5. Log in**

Use the role-switcher on the login screen as before — it now signs in as
the matching seeded MongoDB user behind the scenes. From here, every
create/edit/delete on Vehicles, Drivers, Trips, Shipments, Maintenance,
Fuel Logs, Expenses, and Documents writes to MongoDB and persists across
refreshes.

**To go back to demo/mock mode** (no backend needed), set
`VITE_USE_MOCKS=true` in `frontend/.env`.
