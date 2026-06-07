/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        accent: {
          DEFAULT: "#00E5FF",
          dim: "#00B8CC",
          glow: "rgba(0,229,255,0.15)",
        },
        gold: {
          DEFAULT: "#FFD060",
          dim: "#CC9E00",
        },
        surface: {
          900: "#080C12",
          800: "#0D1117",
          700: "#131A24",
          600: "#1A2332",
          500: "#243040",
          400: "#2E3F54",
        },
        light: {
          bg: "#F0F4F8",
          card: "#FFFFFF",
          border: "#DDE3EC",
          text: "#1A2332",
          muted: "#5A7090",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "slide-in": "slideIn 0.3s ease forwards",
        pulse_slow: "pulse 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        slideIn: { from: { opacity: 0, transform: "translateX(-20px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        glow: { from: { boxShadow: "0 0 10px rgba(0,229,255,0.2)" }, to: { boxShadow: "0 0 30px rgba(0,229,255,0.5)" } },
      },
    },
  },
  plugins: [],
};
