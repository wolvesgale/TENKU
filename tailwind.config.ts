import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        background: "#0d1117",
        surface: "#111827",
        muted: "#9ca3af",
        border: "#1f2937",
        ring: "#7dd3fc",
        brand: {
          blue: "#7dd3fc",
          teal: "#5eead4",
          violet: "#a78bfa",
          amber: "#fbbf24",
        },
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.35)",
        ring: "0 0 0 1px rgba(125, 211, 252, 0.4)",
      },
      borderRadius: {
        lg: "14px",
        md: "12px",
        sm: "10px",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
