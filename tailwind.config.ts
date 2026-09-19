import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cc: {
          "dark-blue": "#213468",
          navy: "#121230",
          "sky-blue": "#213468",
          "light-blue": "#ABBCC6",
          "light-green": "#89AF94",
        },
        // Values live in app/globals.css so a route can retheme by setting
        // the variables (see .theme-gala for the 2026 Gala).
        sftc: {
          ink: "rgb(var(--sftc-ink) / <alpha-value>)",
          evening: "rgb(var(--sftc-evening) / <alpha-value>)",
          navy: "rgb(var(--sftc-navy) / <alpha-value>)",
          ivory: "rgb(var(--sftc-ivory) / <alpha-value>)",
          stone: "rgb(var(--sftc-stone) / <alpha-value>)",
          brass: "rgb(var(--sftc-brass) / <alpha-value>)",
          gold: "rgb(var(--sftc-gold) / <alpha-value>)",
          hope: "rgb(var(--sftc-hope) / <alpha-value>)",
        },
        bfb: {
          ink: "#11132F",
          navy: "#112F6D",
          blue: "#3F9FEC",
          light: "#E8E9EA",
          green: "#5DCBA3",
          cream: "#F7F8F4",
        },
      },
      fontFamily: {
        heading: ["Proxima Nova", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Arbeit", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        label: ["var(--font-label)", "Cormorant Garamond", "Georgia", "serif"],
        accent: ["Sweet Sucker Punch", "Marker Felt", "Comic Sans MS", "cursive"],
        script: ["Great Vibes", "Brush Script MT", "cursive"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(17, 19, 47, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
