import React, { useMemo, useState } from "react";
import BillInput from "../components/BillInput.jsx";
import PredictionChart from "../components/PredictionChart.jsx";
import SavingTips from "../components/SavingTips.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { loadBillsFromStorage, saveBillsToStorage } from "../services/offlineStorage";
import { predictBill } from "../services/api";
import { syncBillsToCloud } from "../services/firebase";

const Home = ({ isOnline }) => {
  const [bills, setBills] = useState(() => loadBillsFromStorage());
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [syncStatus, setSyncStatus] = useState("");

  const handleAddBill = (bill) => {
    const updated = [...bills, bill].slice(-6); // keep last 6 months
    setBills(updated);
    saveBillsToStorage(updated);
  };

  const handlePredict = async () => {
    if (bills.length < 3) {
      alert("कम से कम 3 महीने के बिल दर्ज करें।");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await predictBill(bills, { isOnline });
      setPrediction(result);
    } catch (e) {
      console.error(e);
      setError(e.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncStatus("");
    const res = await syncBillsToCloud(bills);
    if (res.success) {
      setSyncStatus("Cloud sync successful.");
    } else {
      setSyncStatus("Cloud sync failed (you can still use app offline).");
    }
  };

  const avgUnits = useMemo(() => {
    if (!bills.length) return 0;
    const total = bills.reduce((sum, b) => sum + Number(b.units), 0);
    return total / bills.length;
  }, [bills]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-xs text-slate-700 mb-2">
          यह ऐप यूपी डिस्कॉम उपभोक्ताओं के लिए बिजली बिल का{" "}
          <span className="font-semibold">सरल अनुमान</span> और{" "}
          <span className="font-semibold">बचत सुझाव</span> देता है। यह{" "}
          <span className="font-semibold">ऑफ़लाइन</span> भी काम कर सकता है।
        </p>
        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
          <li>पिछले 3–6 महीने के बिल यूनिट और राशि दर्ज करें।</li>
          <li>ऐप अगला अनुमानित यूनिट और बिल राशि दिखाएगा।</li>
          <li>हिंदी में बिजली बचत के सुझाव भी मिलेंगे (वॉइस के साथ)।</li>
        </ul>
      </div>

      <BillInput onAddBill={handleAddBill} bills={bills} />

      <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <button
            type="button"
            onClick={handlePredict}
            className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded shadow-sm transition disabled:opacity-60"
            disabled={bills.length < 3 || loading}
          >
            अगला बिल अनुमानित करें (Predict Next Bill)
          </button>

          <button
            type="button"
            onClick={handleSync}
            className="border border-primary text-primary text-xs px-3 py-1 rounded hover:bg-emerald-50 transition"
          >
            डेटा क्लाउड में सेव करें (Optional Sync)
          </button>
        </div>

        {loading && <LoadingSpinner label="अनुमान निकाल रहे हैं..." />}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

        {prediction && (
          <div className="mt-2 text-sm bg-emerald-50 border border-emerald-200 rounded p-3">
            <p className="font-semibold mb-1">अनुमानित अगला बिल:</p>
            <p>
              अनुमानित यूनिट:{" "}
              <span className="font-semibold">
                {prediction.predicted_units.toFixed(2)} Units
              </span>
            </p>
            <p>
              अनुमानित बिल राशि:{" "}
              <span className="font-semibold">
                ₹ {prediction.predicted_amount.toFixed(2)}
              </span>
            </p>
            <p className="text-xs text-slate-600 mt-1">
              उपयोग तापमान:{" "}
              {prediction.temperature_c
                ? `${prediction.temperature_c.toFixed(1)}°C`
                : "N/A"}{" "}
              | स्रोत: {prediction.source}
            </p>
          </div>
        )}

        {syncStatus && (
          <p className="text-xs text-slate-600 mt-1">{syncStatus}</p>
        )}
      </div>

      <PredictionChart bills={bills} prediction={prediction} />

      <SavingTips averageUnits={avgUnits} prediction={prediction} />
    </div>
  );
};

export default Home;

