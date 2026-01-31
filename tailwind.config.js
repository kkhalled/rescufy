/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ← THIS is the key
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
           backgroundImage: {
        "gradient-danger": "var(--gradient-danger)",
      },
      },
    },
  },
  plugins: [],
};
