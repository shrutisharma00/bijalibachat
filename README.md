# Bijli Bachat – बिजली बचत 

Bijli Bachat is an **offline-capable PWA** that helps **UP DISCOM** (Uttar Pradesh, India) electricity consumers **predict their next month's bill** and receive **personalized Hindi saving tips**.

The system uses:

- **React + Vite + Tailwind CSS** for a mobile-first Hindi UI
- **Chart.js** to visualize monthly usage and compare with the **average UP household (~200 units/month)**
- **FastAPI + scikit-learn** for simple linear regression based prediction
- **OpenWeatherMap** (Bareilly coordinates) to adjust predictions using current temperature
- **Firebase Firestore** (anonymous, optional) to sync usage history
- **PWA (manifest + service worker)** for offline support and installability

---

## Project Structure

```text
bijli-bachat/
  frontend/        # React Vite PWA
  backend/         # FastAPI + scikit-learn API
  docs/            # Documentation
```

Key frontend files:

- `frontend/public/index.html` – root HTML + Hindi font
- `frontend/public/manifest.json` – PWA manifest
- `frontend/public/icons/` – PWA icons (192x192, 512x512)
- `frontend/src/App.jsx` – app shell and online/offline status
- `frontend/src/pages/Home.jsx` – main screen: bill input, prediction, charts, tips
- `frontend/src/components/BillInput.jsx` – last 3–6 bills input form
- `frontend/src/components/PredictionChart.jsx` – Chart.js usage vs UP average
- `frontend/src/components/SavingTips.jsx` – Hindi tips + Web Speech Synthesis
- `frontend/src/services/api.js` – backend + offline regression fallback
- `frontend/src/services/offlineStorage.js` – localStorage-based offline storage
- `frontend/src/services/firebase.js` – Firestore sync (optional)
- `frontend/src/utils/hindiTips.js` – static Hindi saving tips
- `frontend/src/utils/constants.js` – constants (UP average, backend URL, etc.)

Key backend files:

- `backend/main.py` – FastAPI app + `/predict` endpoint
- `backend/models.py` – Pydantic models (`BillsInput`, `BillItem`, `PredictionOutput`)
- `backend/utils/predictor.py` – scikit-learn regression + temperature adjustment
- `backend/requirements.txt` – backend dependencies
- `backend/.env.example` – example environment variables

---

## Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Chart.js 4, vite-plugin-pwa
- **Backend**: FastAPI, Uvicorn, scikit-learn, NumPy, Requests
- **Database**: Firebase Firestore (anonymous, optional)
- **PWA**: manifest.json + service worker (auto from `vite-plugin-pwa`)
- **Weather**: OpenWeatherMap free API (Bareilly, UP)

---

## Setup Instructions

### 1. Prerequisites

- Node.js (>= 18)
- Python (>= 3.10)
- A free **OpenWeatherMap** API key
- Optional: Firebase project for Firestore

---

### 2. Backend Setup (FastAPI)

```bash
cd bijli-bachat/backend
python -m venv venv
venv\Scripts\activate  # on Windows
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill your OpenWeather API key:

```text
OPENWEATHER_API_KEY=your_real_key_here
CORS_ORIGINS=http://localhost:5173
```

Run backend:

```bash
uvicorn backend.main:app --reload --port 8000
```

Test in browser:

- `http://localhost:8000/health` → should return `{ "status": "ok" }`

---

### 3. Frontend Setup (React + Vite PWA)

```bash
cd bijli-bachat/frontend
npm install
```

Create a `.env` file (optional but recommended):

```text
VITE_BACKEND_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxxxxxx
```

Run frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## How the Prediction Works

1. **User inputs last 3–6 months** of bills (month, year, units, amount).
2. Frontend sends this data to `POST /predict` (if **online**) or uses a **local linear regression** fallback (if **offline**).
3. Backend:
   - Builds a simple **LinearRegression** model on (month index → units).
   - Calls **OpenWeatherMap** to get current temperature for **Bareilly (lat 28.3670, lon 79.4300)**.
   - Adjusts predicted units by a **temperature factor** (hotter → more units, cooler → fewer).
   - Approximates **Rs per unit** from past bills and multiplies to get predicted bill amount.
   - If weather call fails, it falls back to **30°C**.

4. Frontend displays:
   - **Predicted units and bill amount**.
   - **Temperature used** and prediction **source** (backend or offline fallback).
   - **Monthly usage chart** against **UP average 200 units/month**.
   - **Hindi saving tips**, with an option to **listen** via Web Speech Synthesis.

---

## PWA & Offline Features

- `vite-plugin-pwa` generates a **service worker** and uses `manifest.json`.
- App can be **installed on Android/Chrome** (Add to Home Screen).
- **Offline behavior**:
  - Last entered bills are stored in **localStorage**.
  - If offline, prediction uses **local JavaScript regression** only.
  - When online, you can optionally **sync** data to Firestore.

---

## Screenshots (Suggested)

Include screenshots in the `docs/` folder for your report/demo:

1. Home screen (Hindi UI, no data)
2. Bills entered list + Predict button
3. Prediction result card (units, amount, temperature)
4. Usage chart vs UP average
5. Saving tips (with Listen button)
6. PWA install prompt on Android

You can capture these after running the app locally.

---

## Future Scope / Extensions

- **OCR bill photo upload**: scan printed electricity bills using OCR and auto-fill units/amount.
- **Tariff slab modelling**: more accurate DISCOM-wise slab calculations instead of flat rate.
- **User profiles & login**: multi-household tracking with secure auth.
- **DISCOM API integration**: fetch historical bills directly from provider APIs.
- **Advanced ML models**: handle seasonality and appliance-level usage.

---

## Demo Video Tips

See `docs/demo-video-plan.md` for a scene-wise demo script outline.

