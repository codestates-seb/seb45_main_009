module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  content: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "btn-color": "#7FBCD9",
        "tag-btn-color": "#FEF000",
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
        "max-768": { max: "768px" },
      },
      animation: {
        "slide-down": "slide-down 0.5s",
        "slide-right": "slide-right 0.5s",
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
        "slide-right": {
          "0%": {
            transform: "translateX(100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
<<<<<<< HEAD
        '.border-after': {
          position: 'relative',
          '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '100%', 
              height: '0.5px',
              width: 'calc(100%)',
              backgroundColor: '#eee',
              transform: 'translateY(-50%)',
          },
      },
      '.border-before': {
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '0', 
            transform: 'translateX(-100%) translateY(-50%)',
            height: '0.5px',
            width: 'calc(100%)',
            backgroundColor: '#eee',
        },
    },
    
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '0px',
            height: '0px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '2px',
=======
        ".border-after": {
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "100%",
            height: "0.5px",
            width: "calc(36vw - 50%)",
            backgroundColor: "gray",
            transform: "translateY(-50%)",
>>>>>>> dev-fe
          },
        },
        ".border-before": {
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "0",
            transform: "translateX(-100%) translateY(-50%)",
            height: "0.5px",
            width: "calc(36vw - 50%)",
            backgroundColor: "gray",
          },
        },
        ".scrollbar-thin": {
          "&::-webkit-scrollbar": {
            width: "0px",
            height: "0px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "2px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "2px",
          },
        },
      };

      addUtilities(newUtilities, ["hover"]);
    },
  ],
};
