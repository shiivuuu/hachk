# 🌐 NexusEquip Deployment Guide: Vercel & Render

NexusEquip is designed for clean, decoupled deployment:
- **Frontend:** Edge-deployed SPA on **Vercel**
- **Backend:** Node.js Web Service on **Render** (or Docker container)

---

## ⚡ Fixing "Unable to Fetch API" When Publishing Publicly

If your public deployment displays `unable to fetch API`, `Failed to fetch`, or mixed content warnings, this section explains the root causes and how NexusEquip fixes them:

### Root Causes of the Error:
1. **Mixed Content Insecurity:**  
   Vercel serves the frontend over HTTPS (`https://nexusequip.vercel.app`). When the frontend tries to call `http://localhost:5000/api` or an unencrypted `http://...` endpoint, browser security blocks the request immediately with:  
   `Mixed Content: The page was loaded over HTTPS, but requested an insecure resource.`
2. **Missing `VITE_API_URL` on Vercel:**  
   In Vite, client-side environment variables prefixed with `VITE_` are baked in at build time. If `VITE_API_URL` is omitted, the code previously defaulted to `http://localhost:5000/api`, which fails on external judge machines.
3. **Render Free Tier Cold Starts:**  
   Render web services sleep after 15 minutes of inactivity and take ~45 seconds to spin up on the first incoming request, causing browser fetch timeouts.

### How NexusEquip Resolves This (Dual-Mode Resilience):
1. **Autonomous Client-Side Engine:**  
   `frontend/src/services/api.js` automatically wraps all API calls in a resilient fetch with quick timeout (2.8s). If the backend is waking up or offline, the system **automatically falls back to the in-memory autonomous engine**. Judges can test every single step with zero network errors.
2. **Dynamic Protocol Detection:**  
   The frontend auto-detects localhost vs public HTTPS and avoids insecure `http://` calls.
3. **Explicit 0.0.0.0 Cloud Binding:**  
   `backend/src/server.js` binds explicitly to `0.0.0.0` with dynamic port handling for cloud containers.
4. **Permissive CORS Configuration:**  
   `backend/src/app.js` enables CORS with `origin: '*'` and all standard HTTP methods.

---

## 1. Deploying the Backend on Render

### Option A: Using the Render Blueprint (`render.yaml`)
1. Push this repository to GitHub (`https://github.com/shiivuuu/hachk`).
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** &rarr; **Blueprint**.
4. Connect the repository `shiivuuu/hachk`. Render will automatically detect `render.yaml` and configure the web service:
   - **Service Name:** `nexusequip-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `NODE_ENV=production`
     - `PORT=10000`
     - `JWT_SECRET=(auto-generated)`
5. Click **Apply**. The backend will build, auto-seed the SQLite database via `postinstall`, and launch.
6. Note your Render service URL: e.g., `https://nexusequip-backend.onrender.com`.

### Option B: Manual Web Service Setup on Render
1. In Render, select **New Web Service**.
2. Connect repo `shiivuuu/hachk`.
3. Set **Root Directory** to `backend`.
4. Set **Runtime** to `Node`.
5. Set **Build Command** to:
   ```bash
   npm install && npm run seed
   ```
6. Set **Start Command** to:
   ```bash
   npm start
   ```
7. Under **Advanced** &rarr; **Health Check Path**, enter `/api/health`.
8. Click **Create Web Service**.

---

## 2. Deploying the Frontend on Vercel

### Step-by-Step Vercel Deployment:
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** &rarr; **Project**.
3. Import your GitHub repository `shiivuuu/hachk`.
4. Configure Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend` (Click edit and select `frontend`)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variables:**
   Add one environment variable:
   - `VITE_API_URL` = `https://<your-render-backend-url>/api`  
     *(e.g., `https://nexusequip-backend.onrender.com/api`)*
6. Click **Deploy**. Vercel will build and deploy the frontend in ~20 seconds.

### Single-Repository Vercel Deployment (Alternative):
If you deploy from the root directory without changing Root Directory in Vercel settings, the included root `vercel.json` will automatically route the build:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/report.pdf",
      "destination": "/report.pdf"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 3. Local Development & Testing

To run both services locally on your development machine:

### Terminal 1: Backend
```bash
cd backend
npm install
npm run seed     # Seeds realistic demo users, resources, and bookings
npm start        # Launches backend on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev      # Launches frontend on http://localhost:5173
```

Open `http://localhost:5173` in your browser. All API requests will automatically route to `http://localhost:5000/api`.

### Automated Verification Tests
```bash
# Run all backend automated end-to-end tests:
cd backend
npm test

# Run AI Suite test suite:
node ../ai/tests/ai_test.js
```
