import { createPreset, presets } from "fumadocs-ui/tailwind-plugin";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./mdx-components.{ts,tsx}",
    "./node_modules/fumadocs-ui/dist/**/*.js",
    "./node_modules/fumadocs-openapi/dist/**/*.js",
  ],
  presets: [
    createPreset({
      addGlobalColors: true,
      preset: {
        ...presets.vitepress,
        light: {
          ...presets.vitepress.light,
          foreground: "240 6% 25%",
          primary: "176 100% 43%",
        },
        dark: {
          ...presets.vitepress.dark,
          background: "0 0% 17%",
          foreground: "0 0% 100%",
          card: "0 0% 17%",
          "card-foreground": "0 0% 100%",
          popover: "0 0% 17%",
          "popover-foreground": "0 0% 100%",
          primary: "176 100% 43%",
          "primary-foreground": "213 16% 27%",
          secondary: "173 8% 22%",
          "secondary-foreground": "0 0% 100%",
          muted: "173 8% 22%",
          "muted-foreground": "0 0% 65%",
          border: "173 8% 22%",
          accent: "173 8% 22%",
          "accent-foreground": "0 0% 100%",
          ring: "197 100% 44%",
        },
        css: {
          ...presets.vitepress.css,
          "button[data-ai-search-full]": {
            backgroundColor: "theme(colors.fd-background)",
          },
        },
      },
    }),
  ],
  theme: {
    extend: {
      keyframes: {
        meteor: {
          "0%": {
            transform: "rotate(215deg) translateX(0)",
            opacity: "1",
          },
          "70%": {
            opacity: "1",
          },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
