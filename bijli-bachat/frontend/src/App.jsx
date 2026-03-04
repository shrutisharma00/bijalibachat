import React, { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-primary text-white px-4 py-3 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">बिजली बचत (Bijli Bachat)</h1>
            <p className="text-xs sm:text-sm opacity-90">
              यूपी डिस्कॉम उपभोक्ताओं के लिए बिजली बिल अनुमान और बचत सुझाव
            </p>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full border ${
              isOnline
                ? "bg-emerald-100 border-emerald-500 text-emerald-700"
                : "bg-red-100 border-red-500 text-red-700"
            }`}
          >
            {isOnline ? "ऑनलाइन" : "ऑफ़लाइन"}
          </span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-3 py-4">
        <Home isOnline={isOnline} />
      </main>
      <footer className="text-center text-xs text-slate-500 pb-4">
        Made for final-year CSE project | Offline-ready PWA
      </footer>
    </div>
  );
}

export default App;

