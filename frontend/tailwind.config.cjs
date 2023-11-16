/** @type {import('tailwindcss').Config}*/
const config = {
     darkMode: "class",
     content: ["./src/**/*.{html,js,svelte,ts}"],
     theme: {
          extend: {
               fontFamily: {
                    jost: ["Jost", "sans-serif"],
               },
               fontSize: {
                    13: "0.8125rem",
                    15: "0.9375rem",
               },
               lineHeight: {
                    19: "1.1875rem",
                    22: "1.375rem",
               },
               screens: {
                    1440: "1440px",
               },
               keyframes: {
                    wiggle: {
                         '0%, 100%': { transform: 'rotate(-3deg)' },
                         '50%': { transform: 'rotate(3deg)' },
                    }
               }
          },
     },
     plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography"), require("@tailwindcss/aspect-ratio")],
};

module.exports = config;
