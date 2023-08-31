module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  content: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "btn-color": "#7FBCD9",
        "feedbtn-color": "#FFF99A",
        "feedbtnhover-color": "#FFF000",
      },
      animation: {
        "slide-down": "slide-down 0.5s",
      },
      keyframes: {
        "slide-down": {
          "0%": {
            opacity: 0,
            transform: "translateY(-40%)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
