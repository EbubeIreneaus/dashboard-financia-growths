/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: "#121212",
        secondary: "#1199fa",
      },
    },
  },

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#121212",

          secondary: "#1199fa",

          accent: "#1d1d1d",

          neutral: "#f3e8ff",

          "base-100": "#9F9F9F",

          info: "#007ed7",

          success: "#009b6f",

          warning: "#eab308",

          error: "#dc2626",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
