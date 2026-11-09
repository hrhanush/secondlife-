# SecondLife — Reusable Item Exchange

A local platform to **gift, swap, or request** reusable items (furniture, books, household goods) and
**automatically match requests with listings by category and approximate location** (pincode / area / city).

Student: H R Hanush (2102508572)

## Stack
- **Client:** React 18 + Vite + React Router, custom responsive CSS (mobile-first, dark-mode aware)
- **Server:** Node.js + Express REST API, Zod input validation, centralized error handling, Helmet, CORS, rate limiting
- **Database:** MongoDB via Mongoose

## Quick start
Prerequisites: Node 18+, MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. API
cd server
cp .env.example .env        # edit MONGO_URI if needed
npm install
npm run seed                # optional demo data
npm run dev                 # http://localhost:5000

# 2. UI (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173  (proxies /api to :5000)
```

## How matching works
Score = same pincode (50) + same 3-digit pincode prefix, i.e. same neighbourhood zone (30) + same area name (20) + same city (10).
Only **available** listings in the **same category** with score > 0 are returned, best first.
- `GET /api/requests/:id/matches` – listings that fit a request
- `GET /api/listings/:id/matches` – open requests that fit a listing

## Ownership without login
Creating a listing/request returns a private `editKey` (saved in your browser). It is required
(`x-edit-key` header) to edit, change status, or delete. Keys are never returned by list/detail endpoints.

## REST API
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Health check |
| GET | /api/stats | Counts for the home page |
| GET | /api/listings?q=&category=&type=&city=&status=&page=&limit= | Search listings |
| POST | /api/listings | Create listing (returns `editKey`) |
| GET | /api/listings/:id | Listing detail |
| PUT | /api/listings/:id | Update (needs key) |
| PATCH | /api/listings/:id/status | `available / reserved / claimed` (needs key) |
| DELETE | /api/listings/:id | Delete (needs key) |
| GET | /api/listings/:id/matches | Matching open requests |
| GET/POST | /api/requests | List / create requests |
| GET/PUT/PATCH/DELETE | /api/requests/:id[/status] | Same pattern as listings (`open / fulfilled`) |
| GET | /api/requests/:id/matches | Matching listings |

Errors always look like `{ "error": { "message": "...", "details": [{ "field": "...", "message": "..." }] } }`.

## Project structure
```
server/src  config/ models/ routes/ middleware/ utils/ app.js index.js seed.js
client/src  pages/ components/ api.js constants.js styles.css App.jsx main.jsx
```
