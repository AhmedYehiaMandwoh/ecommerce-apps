/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.tsx", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#0751e8", dark: "#0640b8", light: "#eaf2ff" }, accent: { DEFAULT: "#ff6a00" } },
    },
  },
  plugins: [],
};
