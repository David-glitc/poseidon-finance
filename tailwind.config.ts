import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#050b14",
        depth: "#0a1628",
        reef: "#0f2847",
        foam: "#7dd3fc",
        coral: "#22d3ee",
        gold: "#fbbf24",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "poseidon-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,211,238,0.18), transparent), linear-gradient(180deg, #050b14 0%, #0a1628 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
