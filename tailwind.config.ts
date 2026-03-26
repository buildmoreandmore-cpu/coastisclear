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
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface2)",
        "surface-3": "var(--surface3)",
        border: "var(--border)",
        "border-active": "var(--border-active)",
        text: "var(--text)",
        "text-mid": "var(--text-mid)",
        "text-dim": "var(--text-dim)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "fade-in-up": "fade-in-up 350ms ease-out forwards",
        "pulse-ring": "pulse-ring 1.4s ease-out infinite",
        "pulse-expand": "pulse-expand 2s ease-out infinite",
        "slide-in": "slide-in 300ms ease-out forwards",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0.3", transform: "scale(0.8)" },
        },
        "pulse-expand": {
          "0%": { opacity: "0.6", transform: "scale(0.5)" },
          "100%": { opacity: "0", transform: "scale(2)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
