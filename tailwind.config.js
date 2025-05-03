// tailwind.config.js
const { heroui } = require("@heroui/theme");
import scrollbarHide from 'tailwind-scrollbar-hide';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/components/(button|input|table|ripple|spinner|form|checkbox|spacer).js"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // fontFamily: {
      //   sans: ['Poppins', 'Roboto', 'sans-serif'],
      // },  
      fontFamily: {
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['__Poppins_3c23ab', 'sans-serif'],
        gilroy: ['Gilroy', 'sans-serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui(),
    scrollbarHide,
  ],
};