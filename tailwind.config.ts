import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiss: {
          bg: "#FFFFFF",
          fg: "#000000",
          muted: "#F2F2F2",
          "muted-border": "#E5E5E5",
          accent: "#FF3000",
          "accent-hover": "#D62700",
          green: "#008A39",
          amber: "#E05300",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Menlo", "Courier New", "monospace"],
      },
      borderRadius: {
        none: "0px",
        DEFAULT: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        full: "0px",
      },
      borderWidth: {
        DEFAULT: "1px",
        "2": "2px",
        "3": "3px",
        "4": "4px",
      },
      transitionTimingFunction: {
        mechanical: "cubic-bezier(0.2, 0.0, 0.0, 1.0)",
      },
    },
  },
  plugins: [],
};

export default config;
