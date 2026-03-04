/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        devanagari: ["'Noto Sans Devanagari'", "system-ui", "sans-serif"]
      },
      colors: {
        primary: {
          DEFAULT: "#047857",
          light: "#34d399",
          dark: "#065f46"
        },
        accent: "#f59e0b"
      }
    }
  },
  plugins: []
};

