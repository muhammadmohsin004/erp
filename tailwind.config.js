/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#C084FC",
          dark: "#7C3AED",
          text: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
          text: "#F59E0B",
          border: "#F59E0B",
        },
      },
    },
  },
  plugins: [],
};
