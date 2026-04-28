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
        sftc: {
          ink: "#11132F",
          evening: "#0D1B3D",
          navy: "#112F6D",
          ivory: "#F7F2EA",
          stone: "#E8E9EA",
          brass: "#B8965A",
          gold: "#D8BE82",
          hope: "#5DCBA3",
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
        display: ["Cormorant Garamond", "Canela", "IvyPresto Display", "Georgia", "serif"],
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
