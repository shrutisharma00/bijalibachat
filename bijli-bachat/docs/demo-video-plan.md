# Bijli Bachat – Demo Video Plan

This is a suggested outline for recording a **final-year project demo video** for _Bijli Bachat_.

Target duration: **8–12 minutes**

---

## 1. Introduction (1–2 min)

- Introduce yourself and your team.
- Briefly explain the **problem statement**:
  - Many UP DISCOM users do not understand their electricity bills.
  - No simple way to **estimate next month's bill**.
  - Need for **Hindi**, **mobile-friendly**, **offline-capable** solution.
- State your **project goal**:
  - "We built an offline-capable PWA named **Bijli Bachat** that predicts electricity bills and gives Hindi saving tips."

---

## 2. System Overview (1–2 min)

- Show the **architecture diagram** (optional slide):
  - React + Vite + Tailwind (PWA frontend)
  - FastAPI + scikit-learn backend
  - OpenWeatherMap API for temperature
  - Firebase Firestore for optional sync
- Mention:
  - Works as a **PWA**, installable on Android.
  - Works **offline** with local prediction.

---

## 3. Live Frontend Demo (4–5 min)

1. **Open Home Screen**
   - Show the Hindi UI.
   - Highlight online/offline indicator.

2. **Enter Historical Bills**
   - Enter **3–6 months** of bills (month, year, units, amount).
   - Show the **table** updating.

3. **Run Prediction**
   - Click "अगला बिल अनुमानित करें".
   - Explain the result card:
     - Predicted units
     - Predicted bill amount
     - Temperature used (from Bareilly) and prediction source (backend / offline).

4. **View Usage Chart**
   - Scroll to the chart section.
   - Explain comparison with **UP average 200 units**.
   - Show how your consumption is above/below average.

5. **Saving Tips + Voice**
   - Show Hindi saving tips list.
   - Click "सुझाव सुनें (Listen)" and demonstrate Web Speech Synthesis.

6. **Offline Mode**
   - Turn off Wi‑Fi / disconnect internet.
   - Refresh or reopen the app.
   - Show that:
     - Bills are still available (from localStorage).
     - Prediction still works using **offline regression fallback**.

7. **PWA Install (if possible)**
   - On Android/Chrome, show "Install app" / "Add to Home Screen".
   - Open the installed app icon.

---

## 4. Backend & ML Explanation (2–3 min)

- Open backend code (`backend/main.py`, `backend/utils/predictor.py`).
- Explain:
  - **/predict** endpoint.
  - **LinearRegression** on month index vs units.
  - Temperature fetched from **OpenWeatherMap** (Bareilly coordinates).
  - Simple temperature factor (hotter days → slightly higher predicted units).
  - Rate per unit estimated from historical bills to compute bill amount.
- Mention fallback:
  - If weather API fails, system uses **30°C** as default.

---

## 5. Database & Offline/Sync (1–2 min)

- Explain:
  - Bills are stored in **localStorage** for offline usage.
  - Optional **Firebase Firestore** sync:
    - Anonymous usage (no login).
    - Useful for analysis / backups.
- Show relevant code or Firestore console (if configured).

---

## 6. Conclusion & Future Work (1–2 min)

- Summarize key features:
  - Hindi UI + voice tips.
  - Predictive model with weather adjustment.
  - Offline-capable PWA, installable on phones.
  - Simple and user-friendly for UP DISCOM consumers.
- Mention **future scope**:
  - OCR-based bill scanning from camera.
  - DISCOM-specific tariff slabs for more accurate bills.
  - User accounts, notification reminders, and more advanced ML models.
- Thank the examiners and invite questions.

