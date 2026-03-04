import React, { useMemo } from "react";
import { getTipsByUsageCategory } from "../utils/hindiTips";
import { UP_AVERAGE_UNITS_PER_MONTH } from "../utils/constants";

const SavingTips = ({ averageUnits, prediction }) => {
  const category = useMemo(() => {
    if (!averageUnits) return "general";
    if (averageUnits > UP_AVERAGE_UNITS_PER_MONTH * 1.3) return "high";
    if (averageUnits < UP_AVERAGE_UNITS_PER_MONTH * 0.7) return "low";
    return "medium";
  }, [averageUnits]);

  const tips = useMemo(() => getTipsByUsageCategory(category), [category]);

  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) {
      alert("आपके ब्राउज़र में वॉइस सपोर्ट उपलब्ध नहीं है।");
      return;
    }
    const text =
      tips.map((t) => t.text).join("। ") +
      (prediction
        ? `। अगला अनुमानित बिल लगभग ${Math.round(
            prediction.predicted_amount
          )} रुपये है।`
        : "");

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN"; // Hindi voice preference
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <div className="flex items-center justify-between mb-2 gap-2">
        <h2 className="text-sm font-semibold">बचत सुझाव (Saving Tips)</h2>
        <button
          type="button"
          onClick={handleSpeak}
          className="text-xs px-3 py-1 rounded bg-accent text-white hover:bg-amber-600 transition"
        >
          सुझाव सुनें (Listen)
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-2">
        औसत यूनिट:{" "}
        <span className="font-semibold">
          {averageUnits ? averageUnits.toFixed(1) : "--"} Units / month
        </span>{" "}
        | यूपी औसत: {UP_AVERAGE_UNITS_PER_MONTH} Units
      </p>

      <ul className="list-disc list-inside space-y-1 text-xs">
        {tips.map((tip) => (
          <li key={tip.id}>{tip.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default SavingTips;

