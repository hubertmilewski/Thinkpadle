
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tp: {
          bg: "#111111",
          card: "#262626",
          red: "#E2231A",
          text: "#F4F4F4",
          green: "#538D4E",
          wrong: "#e7000b",
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
