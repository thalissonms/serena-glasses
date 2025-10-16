// Tailwind v4 ESM config
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** FASE 2: Config completo para Tailwind v4 */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./dev/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx,mdx}",
    "./styles/tailwind.css"
  ],
  plugins: [forms, typography]
};