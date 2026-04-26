/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        app: "#0b1220",
        "app-bg": "#edf4ff",
        glass: "rgba(255, 255, 255, 0.06)"
      },
      boxShadow: {
        glow: "0 8px 35px rgba(0, 0, 0, 0.25)"
      }
    }
  },
  plugins: []
};

