module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  content: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      'custom-color': '#97EAF0',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
