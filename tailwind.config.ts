import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b1120",
        panel: "rgba(30, 41, 59, 0.6)",
        neon: {
          green: "#3ef3c3",
          cyan: "#58d0ff",
          purple: "#8b5cf6",
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(62, 243, 195, 0.4)",
        inset: "inset 0 0 0 1px rgba(255,255,255,0.05)",
      },
      fontFamily: {
        sans: ["Inter", "var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI"],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(62, 243, 195, 0.5)" },
          "50%": { boxShadow: "0 0 0 10px rgba(62, 243, 195, 0)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
