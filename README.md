<div align="center">

# ♻️ SecondLife

### A hyper-local exchange platform to **gift, swap, and request** reusable items, with smart location-based matching.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-REST_API-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Deployed](https://img.shields.io/badge/Deployed-Vercel_+_Render-black)

[**🌐 Live Demo**](https://YOUR-VERCEL-URL.vercel.app) · [**⚙️ API Health**](https://secondlife-api-gz2o.onrender.com/api/health) · [**🐛 Report a Bug**](https://github.com/hrhanush/secondlife-/issues)

</div>

---

## 📖 Overview

Every year, perfectly usable furniture, books and household goods end up in landfills while someone nearby needs exactly that item. **SecondLife** connects the two.

People can **list** items they want to give away or swap, or **post a request** for something they need. The platform then **automatically matches** requests with listings by **category and approximate location** (pincode, area, city), with no sign-up required.

> **Why it matters:** it promotes reuse, reduces waste, and keeps exchanges local and free.

---

## 📸 Screenshots

| Home | Browse | Item detail |
|:---:|:---:|:---:|
| ![Home](docs/home.png) | ![Browse](docs/browse.png) | ![Detail](docs/detail.png) |

> 💡 *Add your screenshots to a `docs/` folder with these names, or edit the paths above.*

---

## ✨ Features

- 🎁 **Gift, swap or request** items (furniture, books, household goods)
- 🧠 **Smart matching engine** that scores listings against requests by location proximity
- 🔎 **Search and filter** by keyword, category, type, city and status
- 🔐 **Login-free ownership** using a private `editKey`, so there's no account friction
- 🔄 **Status tracking**: `available → reserved → claimed` (requests: `open → fulfilled`)
- 📱 **Responsive, mobile-first UI** with dark-mode support
- 🛡️ **Production-minded backend**: validation, rate limiting, security headers, centralized error handling

---

## 🧠 How Matching Works

Each listing is scored against a request using a weighted location score:

| Signal | Points |
|---|:---:|
| Same pincode | **50** |
| Same 3-digit pincode prefix (same neighbourhood zone) | **30** |
| Same area name | **20** |
| Same city | **10** |

Only **available** listings in the **same category** with a score **> 0** are returned, **best match first**.

```
GET /api/requests/:id/matches   →  listings that fit a request
GET /api/listings/:id/matches   →  open requests that fit a listing
```

---

## 🏗️ Architecture

```
┌──────────────┐     /api/*      ┌────────────────┐      ┌────────────────┐
│  React + Vite │ ─────────────▶ │ Express REST   │ ───▶ │ MongoDB Atlas  │
│   (Vercel)    │   (rewrite)    │ API  (Render)  │      │   (Mongoose)   │
└──────────────┘                 └────────────────┘      └────────────────┘
```

- **Client:** React 18, Vite, React Router, custom responsive CSS
- **Server:** Node.js, Express, Zod validation, Helmet, CORS, rate limiting
- **Database:** MongoDB with Mongoose models
- **Hosting:** Vercel (UI) and Render (API), with MongoDB Atlas for the database

---

## 🔐 Ownership Without Login

Creating a listing or request returns a private **`editKey`**, saved in your browser. It must be sent in the `x-edit-key` header to edit, change status, or delete. Keys are **never** returned by list or detail endpoints.

---

## 🔌 REST API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/stats` | Counts for the home page |
| `GET` | `/api/listings?q=&category=&type=&city=&status=&page=&limit=` | Search listings |
| `POST` | `/api/listings` | Create listing (returns `editKey`) |
| `GET` | `/api/listings/:id` | Listing detail |
| `PUT` | `/api/listings/:id` | Update (needs key) |
| `PATCH` | `/api/listings/:id/status` | `available` / `reserved` / `claimed` (needs key) |
| `DELETE` | `/api/listings/:id` | Delete (needs key) |
| `GET` | `/api/listings/:id/matches` | Matching open requests |
| `GET` `POST` | `/api/requests` | List / create requests |
| `GET` `PUT` `PATCH` `DELETE` | `/api/requests/:id[/status]` | Same pattern (`open` / `fulfilled`) |
| `GET` | `/api/requests/:id/matches` | Matching listings |

Errors are consistent across the API:

```json
{ "error": { "message": "...", "details": [{ "field": "...", "message": "..." }] } }
```

---

## 🚀 Run Locally

**Prerequisites:** Node 18+ and a MongoDB Atlas URI (or a local MongoDB).

```bash
# 1. Clone
git clone https://github.com/hrhanush/secondlife-.git
cd secondlife-

# 2. API
cd server
cp .env.example .env        # set MONGO_URI
npm install
npm run seed                # optional demo data
npm run dev                 # http://localhost:5000

# 3. UI (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173  (proxies /api to :5000)
```

---

## 📁 Project Structure

```
secondlife/
├── client/
│   └── src/   pages/  components/  api.js  constants.js  styles.css  App.jsx  main.jsx
└── server/
    └── src/   config/  models/  routes/  middleware/  utils/  app.js  index.js  seed.js
```

---

## 🛣️ Roadmap

- [ ] Image uploads for listings
- [ ] In-app messaging between givers and receivers
- [ ] Map view with distance-based matching
- [ ] Email notifications when a match appears
- [ ] Automated tests (Jest + Supertest)

---

## 👤 Author

**H R Hanush**

[![GitHub](https://img.shields.io/badge/GitHub-hrhanush-181717?logo=github)](https://github.com/hrhanush)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin)](https://www.linkedin.com/in/YOUR-LINKEDIN)

⭐ If you like this project, consider giving it a star!
