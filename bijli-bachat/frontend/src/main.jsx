import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Register service worker for PWA (offline support)
registerSW({
  onNeedRefresh() {
    // Hindi + English comment: user can refresh to get new version
    // नया वर्शन उपलब्ध है, पेज रिफ्रेश कर सकते हैं
    // eslint-disable-next-line no-alert
    if (confirm("नया वर्शन उपलब्ध है। क्या आप पेज रिफ्रेश करना चाहेंगे?")) {
      window.location.reload();
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

