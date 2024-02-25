// tailwind.config.js

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        purpleHeart: {
          50: "#ecefff",
          100: "#dce2ff",
          200: "#c0c8ff",
          300: "#9aa3ff",
          400: "#7273ff",
          500: "#5d51ff",
          600: "#5032f9",
          700: "#5134df",
          800: "#3821b2",
          900: "#31238c",
          950: "#1f1551",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
