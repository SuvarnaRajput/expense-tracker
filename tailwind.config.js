/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FACC15",       // yellow
        primaryHover: "#EAB308",

        bgApp: {
          light: "#F8FAFC",
          dark: "#020617",
        },

        card: {
          light: "#FFFFFF",
          dark: "#111827",
        },

        textMain: {
          light: "#0F172A",
          dark: "#F9FAFB",
        },

        textMuted: {
          light: "#64748B",
          dark: "#94A3B8",
        },
      },
      borderRadius: {
        xl: "14px",
      },
    },
  },
  plugins: [],
};
