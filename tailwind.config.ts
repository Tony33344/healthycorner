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
        primary: {
          DEFAULT: "#A4B82C",
          50: "#F5F7E8",
          100: "#E8ECC8",
          200: "#D5DC9F",
          300: "#C2CC76",
          400: "#B3C251",
          500: "#A4B82C",
          600: "#8A9D24",
          700: "#6F811D",
          800: "#546516",
          900: "#39490F",
        },
        accent: {
          DEFAULT: "#FF6B35",
          50: "#FFE8E0",
          100: "#FFD4C7",
          200: "#FFAD95",
          300: "#FF8663",
          400: "#FF7E4C",
          500: "#FF6B35",
          600: "#FF4500",
          700: "#CC3700",
          800: "#992900",
          900: "#661B00",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
