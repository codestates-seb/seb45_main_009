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
        "modify-btn-color": "#97EBF0",
        bts: "#7FBCD9",
        "bts-hover": "#6a9fb8",
        bdc: "#D9D9D9",
        btc: "#676767",
        "isValid-text-red": "#EC0000",
        sbc: "#7DD9C4",
        "sbc-hover": "4dab95",
      },
      screens: {
        "max-tablet": { max: "1024px" },
        "max-mobile": { max: "425px" },
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
