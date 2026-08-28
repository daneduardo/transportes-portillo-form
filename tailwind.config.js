/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B2545",
          light: "#143A63",
          dark: "#071A33",
        },
        brandgreen: {
          DEFAULT: "#7CB93F",
          dark: "#5C9A2C",
          light: "#A6D876",
        },
        ink: "#33404F",
        paper: "#F7F8FA",
      },
      fontFamily: {
        display: ["Oswald", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  daisyui: {
    themes: [
      {
        portillo: {
          primary: "#0B2545",
          secondary: "#7CB93F",
          accent: "#7CB93F",
          neutral: "#33404F",
          "base-100": "#FFFFFF",
          info: "#143A63",
          success: "#5C9A2C",
          warning: "#E8A33D",
          error: "#C4453C",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
