import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
    "glow-move": "glowMove 15s infinite alternate-reverse cubic-bezier(0.45, 0.05, 0.55, 0.95)",
    "glow-float": "glowFloat 8s infinite alternate cubic-bezier(0.4, 0, 0.6, 1)",
    "glow-float-reverse": "glowFloatReverse 4s infinite alternate cubic-bezier(0.6, 0.1, 0.4, 0.9)",
    "glow-pulse": "glowPulse 7s infinite ease-in-out",
    "glow-rotate": "glowRotate 20s linear infinite",
  "text-glow": "textGlow 2s infinite alternate ease-in",
},
  },
  keyframes: {
    glowMove: {
      "0%": { transform: "translateY(-30px) translateX(-20px) rotate(-5deg)", opacity: "0.4" },
      "50%": { transform: "translateY(5px) translateX(10px) rotate(3deg)", opacity: "0.8" },
      "100%": { transform: "translateY(30px) translateX(20px) rotate(5deg)", opacity: "0.6" },
    },
    glowFloat: {
      "0%": { transform: "translateY(-15px) translateX(-10px) scale(1.05)", opacity: "0.3" },
      "50%": { transform: "translateY(0px) translateX(0px) scale(1.15)", opacity: "0.7" },
      "100%": { transform: "translateY(15px) translateX(10px) scale(1.25)", opacity: "0.5" },
    },
    glowFloatReverse: {
      "0%": { transform: "translateY(15px) translateX(10px) scale(1.2) skew(2deg)", opacity: "0.5" },
      "50%": { transform: "translateY(0px) translateX(-5px) scale(1.15) skew(-1deg)", opacity: "0.8" },
      "100%": { transform: "translateY(-15px) translateX(-10px) scale(1.1) skew(-3deg)", opacity: "0.4" },
    },
    glowPulse: {
      "0%": { filter: "blur(5px) brightness(1)", transform: "scale(1)" },
      "50%": { filter: "blur(10px) brightness(1.3)", transform: "scale(1.1)" },
      "100%": { filter: "blur(5px) brightness(1)", transform: "scale(1)" },
    },
    glowRotate: {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
     textGlow: {
    "0%": { textShadow: "0 0 5px rgba(255, 255, 255, 0.3), 0 0 5px rgba(255, 255, 255, 0.3)" },
    "50%": { textShadow: "0 0 5px rgba(255, 255, 255, 0.6), 0 0 2px rgba(255, 255, 255, 0.8)" },
    "100%": { textShadow: "0 0 5px rgba(255, 255, 255, 0.3), 0 0 5px rgba(255, 255, 255, 0.3)" },
  },
  },
  },
  plugins: [],
} satisfies Config;


