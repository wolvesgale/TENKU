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
        background: "#0c111b",
        surface: "#111827",
        panel: "rgba(17, 24, 39, 0.7)",
        brand: {
          blue: "#6ac8ff",
          teal: "#5cf0d9",
          violet: "#9b8cff",
          amber: "#f7c266",
        },
        gray: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      boxShadow: {
        neon: "0 10px 40px rgba(106, 200, 255, 0.25)",
        inset: "inset 0 0 0 1px rgba(255,255,255,0.05)",
        ring: "0 0 0 1px rgba(106, 200, 255, 0.4)",
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
