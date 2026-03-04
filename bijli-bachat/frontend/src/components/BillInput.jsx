import React, { useState } from "react";

const currentYear = new Date().getFullYear();

const BillInput = ({ onAddBill, bills }) => {
  const [form, setForm] = useState({
    month: "",
    year: currentYear,
    units: "",
    amount: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.month || !form.year || !form.units || !form.amount) {
      alert("कृपया सभी फ़ील्ड भरें।");
      return;
    }

    onAddBill({
      ...form,
      year: Number(form.year),
      units: Number(form.units),
      amount: Number(form.amount)
    });

    setForm((prev) => ({
      ...prev,
      units: "",
      amount: ""
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">
        पिछले बिल जोड़ें (Last 3–6 months)
      </h2>
      <form
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label className="text-xs mb-1">महीना (Month)</label>
          <select
            name="month"
            value={form.month}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">चुनें</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs mb-1">साल (Year)</label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm"
            min={2000}
            max={currentYear + 1}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs mb-1">यूनिट (Units)</label>
          <input
            type="number"
            name="units"
            value={form.units}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm"
            min={0}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs mb-1">बिल राशि (₹ Amount)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm"
            min={0}
            step="0.01"
          />
        </div>

        <div className="col-span-2 sm:col-span-4 flex justify-end mt-2">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded shadow-sm transition"
          >
            बिल जोड़ें (Add Bill)
          </button>
        </div>
      </form>

      {bills.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-xs border">
            <thead className="bg-slate-50">
              <tr>
                <th className="border px-2 py-1 text-left">महीना</th>
                <th className="border px-2 py-1 text-left">साल</th>
                <th className="border px-2 py-1 text-right">यूनिट</th>
                <th className="border px-2 py-1 text-right">बिल (₹)</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((b, idx) => (
                <tr key={`${b.month}-${b.year}-${idx}`}>
                  <td className="border px-2 py-1">{b.month}</td>
                  <td className="border px-2 py-1">{b.year}</td>
                  <td className="border px-2 py-1 text-right">{b.units}</td>
                  <td className="border px-2 py-1 text-right">{b.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BillInput;

