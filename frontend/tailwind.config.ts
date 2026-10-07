import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17202e",
        panel: "#ffffff",
        canvas: "#f1f4f6",
        teal: {
          50: "#ecfdf9",
          100: "#d2f7ee",
          500: "#0d9f8b",
          600: "#087e70",
          700: "#07665d"
        },
        hot: "#ef6a42",
        cold: "#2f7edb"
      },
      boxShadow: {
        panel: "0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 28px rgba(16, 24, 40, 0.05)"
      }
    }
  },
  plugins: [],
};

export default config;
