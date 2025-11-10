/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        dark: "#0f0f0f",
        light: "#1a1a1a",
        accent: "#6366f1", // Indigo
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
