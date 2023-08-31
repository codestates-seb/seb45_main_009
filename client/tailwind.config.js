module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  content: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        bts: "#7FBCD9",
        bdc: "#D9D9D9",
        btc: "#676767",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
