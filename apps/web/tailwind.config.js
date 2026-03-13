/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#137fec",
        "secondary": "#008080", // Keep reference just in case
        "background-light": "#f6f7f8",
        "background-dark": "#0a0a0a",
        "surface-light": "#ffffff", // Mapped to align with light mode design
        "surface-dark": "#121212",
        "surface-border": "rgba(255, 255, 255, 0.12)",
        "text-primary": "#1f2937",
        "text-secondary": "#4b5563",
        // IDE Params
        "ide-bg": "#ffffff",
        "ide-sidebar": "#f3f3f3",
        "ide-border": "#e1e4e8",
        "code-keyword": "#c678dd",
        "code-string": "#98c379",
        "code-key": "#e06c75",
        "code-num": "#d19a66",
        "code-comment": "#a0a1a7",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "mono": ["Fira Code", "monospace"],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
