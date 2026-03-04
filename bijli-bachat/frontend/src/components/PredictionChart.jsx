import React, { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip
} from "chart.js";
import { UP_AVERAGE_UNITS_PER_MONTH } from "../utils/constants";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip
);

const PredictionChart = ({ bills, prediction }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");

    const labels = bills.map((b) => `${b.month}-${b.year}`);
    const unitsData = bills.map((b) => Number(b.units));
    const avgLine = bills.map(() => UP_AVERAGE_UNITS_PER_MONTH);

    if (prediction && prediction.predicted_units) {
      labels.push("Next");
      unitsData.push(prediction.predicted_units);
      avgLine.push(UP_AVERAGE_UNITS_PER_MONTH);
    }

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "आपकी खपत (Units)",
            data: unitsData,
            borderColor: "#047857",
            backgroundColor: "rgba(4, 120, 87, 0.2)",
            tension: 0.2
          },
          {
            label: "औसत यूपी घर (200 Units)",
            data: avgLine,
            borderColor: "#f97316",
            borderDash: [6, 4],
            tension: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 10
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "यूनिट (Units)"
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [bills, prediction]);

  if (!bills.length) {
    return (
      <p className="text-xs text-slate-500">
        चार्ट देखने के लिए पहले कुछ बिल जोड़ें।
      </p>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4 h-64">
      <h2 className="text-sm font-semibold mb-2">
        मासिक खपत चार्ट (Monthly Usage)
      </h2>
      <div className="h-52">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default PredictionChart;

