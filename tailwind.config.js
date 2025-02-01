/** @type {import('tailwindcss').Config} */
import typographyPlugin from "@tailwindcss/typography";
import defaultTheme from "tailwindcss/defaultTheme";

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      xxs: "380px",
      xs: "480px",
      ...defaultTheme.screens,
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["Satoshi", ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        18: "4.5rem",
        112: "28rem",
        120: "30rem",
        140: "35rem",
        160: "40rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), typographyPlugin],
};
