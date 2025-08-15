/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Add your custom colors, fonts, etc. here
      colors: {
        primary: "#3B82F6",
        secondary: "#10B981",
      },

      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        mono: ["monospace"],
      },
      gridTemplateColumns: {
        "70/30": "70% 28%",
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  plugins: [],
};
