# Obscura

Privacy-first app for submitting leaks, viewing leaks, and requesting leaks — with a clean, minimal UI.

---

## Features

* Submit a leak with a short description and attached ZK proof JSON
* View published leaks in aesthetic cards
* Request leaks (title + details) and support requests with likes
* Light theme, consistent typography (IBM Plex Sans + JetBrains Mono)
* Simple JSON-file persistence for local/dev

---

## Tech

* Next.js (App Router, TypeScript)
* Tailwind (utility classes in components)
* Framer Motion (micro-animations)
* lucide-react icons
* ZK email/Circom proof JSON ingestion (blueprint slug configurable)

---

## Prerequisites

* Node.js 18+ (Node 20 recommended)
* npm or pnpm
* macOS/Linux/WSL (Windows works too)

---

## Quick Start

```bash
# 1) Install deps
npm i

# 2) Create data dir for local JSON storage
mkdir -p data

# 3) Configure env (see below)
cp .env.example .env.local
# edit .env.local

# 4) Run dev
npm run dev
# app at http://localhost:3000
```

---

## Environment

Create `.env.local`:

go to MongoDB Atlas and generate API key as and save it in .env.local as:

MONGODB_URI="***********"

---

## Project Structure (key files)

```
app/
  api/
    publish/route.ts          # POST: store a leak
    leaks/route.ts            # GET: list leaks
    requests/route.ts         # GET/POST: list/create requests
    requests/[id]/like/route.ts  # POST: like a request
  components/
    NavBar.tsx
    featurebutton.tsx
  dashboard/page.tsx          # Submit Leak page
  leaks/page.tsx              # View Leaks page
  request/page.tsx            # Request Leak page
lib/
  types/
    leaks.ts
    requests.ts
  schemas/
    leaks.ts
    requests.ts
  verify.ts                   # (helper for local proof checks)
data/                         # JSON storage (created at runtime)
public/
  verification_key.json       # (optional if you use snarkjs fallback)
```

---

## Pages & Routes

* **/** → landing (brand link target)
* **/dashboard** → Submit Leak (upload email, generate proof, publish)
* **/leaks** → View Leaks (cards, per-card Verify button)
* **/request** → Request Leak (create + like requests)

Top-right nav: **Submit Leak** / **View Leaks** / **Request Leak**

---

## Local JSON Storage

* Leaks: `data/leaks.json`
* Requests: `data/requests.json`

API handlers read/write these files. In dev, ensure `data/` exists and app has write permissions.

If you prefer a different folder:

```
DATA_DIR=/absolute/path/to/persistent/folder
```

---

## Scripts

```bash
npm run dev       # start Next.js in dev
npm run build     # production build
npm start         # run production server
```

---

## Minimal Setup Guide

1. **Install & run**

   ```bash
   npm i
   mkdir -p data
   cp .env.example .env.local && vi .env.local
   npm run dev
   ```

2. **Submit a leak**

   * Go to **/dashboard**
   * Upload an email file (.eml)
   * Generate proof (browser or remote)
   * Add a short description
   * **Publish**

3. **View leaks**

   * Go to **/leaks**
   * See newly published leak card(s)

4. **Request a leak**

   * Go to **/request**
   * Create a request (title + details)
   * Like requests you support

---

## Deployment Notes

* File-based JSON storage **does not persist** on most serverless hosts.
* For production, use:

  * **Vercel + Postgres** (Supabase/Neon/Vercel Postgres), or
  * A host with **persistent volumes** (Fly.io, Render, Railway, VPS).

To keep JSON in production, run with a mounted volume and set `DATA_DIR` to that mount path.

---

## Types & Validation

* Strict schemas with **Zod** (`lib/schemas/*`)
* Strong types for API payloads and UI models (`lib/types/*`)
* No `any`

---

## Common Pitfalls

* Ensure `NEXT_PUBLIC_BLUEPRINT_SLUG` is the same across submit + leaks pages.
* If you change data shape, delete old `data/*.json` during dev to avoid schema mismatches.

---

## License
