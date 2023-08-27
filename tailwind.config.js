/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        "berry-blue": "#5458F7",
        "light-blue": "F0F2F5",
        grey: "#525252",
        "netural-100": "#f0f0f0",
        "neutral-300": "#d3d3d3",
        "neutral-400": "#bfbfbf",
        "neutral-500": "#777777",
      },
      fontFamily: {
        pattaya: ["Pattaya", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
