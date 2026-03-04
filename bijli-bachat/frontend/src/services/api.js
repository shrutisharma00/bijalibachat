import { BACKEND_BASE_URL } from "../utils/constants";

// Simple JS linear regression as offline fallback (बेसिक अनुमान)
function localLinearRegression(bills) {
  if (!bills || bills.length < 2) return null;

  const xs = bills.map((_, idx) => idx + 1);
  const ys = bills.map((b) => Number(b.units));
  const n = xs.length;

  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((acc, x, i) => acc + x * ys[i], 0);
  const sumX2 = xs.reduce((acc, x) => acc + x * x, 0);

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  const nextX = n + 1;
  const predictedUnits = slope * nextX + intercept;
  return Math.max(predictedUnits, 0);
}

export async function predictBill(bills, { isOnline }) {
  // If we are offline, use local regression only
  if (!isOnline) {
    const units = localLinearRegression(bills);
    if (units == null) {
      throw new Error(
        "ऑफ़लाइन अनुमान के लिए कम से कम 2 महीने का डेटा होना ज़रूरी है।"
      );
    }
    // Simple rate assumption for offline: Rs 7 per unit (approx)
    const rate = 7;
    const amount = units * rate;
    return {
      source: "offline-local",
      predicted_units: Number(units.toFixed(2)),
      predicted_amount: Number(amount.toFixed(2)),
      temperature_c: 30
    };
  }

  // Online: call backend FastAPI
  const payload = {
    bills: bills.map((b) => ({
      month: b.month,
      year: Number(b.year),
      units: Number(b.units),
      amount: Number(b.amount)
    }))
  };

  const res = await fetch(`${BACKEND_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    // Fallback to offline regression if backend fails
    const units = localLinearRegression(bills);
    if (units == null) {
      throw new Error("Prediction failed from server and local fallback.");
    }
    const rate = 7;
    const amount = units * rate;
    return {
      source: "offline-fallback",
      predicted_units: Number(units.toFixed(2)),
      predicted_amount: Number(amount.toFixed(2)),
      temperature_c: 30
    };
  }

  const data = await res.json();
  return {
    source: "backend",
    ...data
  };
}

