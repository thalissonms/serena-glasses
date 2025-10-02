// tailwind.config.ts
import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base semantic colors usando CSS custom properties
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        'card-foreground': "var(--card-foreground)",
        popover: "var(--popover)",
        'popover-foreground': "var(--popover-foreground)",
        primary: "var(--primary)",
        'primary-foreground': "var(--primary-foreground)",
        secondary: "var(--secondary)",
        'secondary-foreground': "var(--secondary-foreground)",
        muted: "var(--muted)",
        'muted-foreground': "var(--muted-foreground)",
        accent: "var(--accent)",
        'accent-foreground': "var(--accent-foreground)",
        destructive: "var(--destructive)",
        'destructive-foreground': "var(--destructive-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        'input-background': "var(--input-background)",
        'switch-background': "var(--switch-background)",
        ring: "var(--ring)",

        // Brand colors
        brand: {
          pink: "var(--brand-pink)",
          'pink-light': "var(--brand-pink-light)",
          black: "var(--brand-black)",
          white: "var(--brand-white)",
        },

        // Chart colors
        'chart-1': "var(--chart-1)",
        'chart-2': "var(--chart-2)",
        'chart-3': "var(--chart-3)",
        'chart-4': "var(--chart-4)",
        'chart-5': "var(--chart-5)",

        // Sidebar colors
        sidebar: "var(--sidebar)",
        'sidebar-foreground': "var(--sidebar-foreground)",
        'sidebar-primary': "var(--sidebar-primary)",
        'sidebar-primary-foreground': "var(--sidebar-primary-foreground)",
        'sidebar-accent': "var(--sidebar-accent)",
        'sidebar-accent-foreground': "var(--sidebar-accent-foreground)",
        'sidebar-border': "var(--sidebar-border)",
        'sidebar-ring': "var(--sidebar-ring)",
      },
      borderRadius: {
        xs: 'calc(var(--radius) * 0.5)',
        sm: 'calc(var(--radius) * 0.75)',
        DEFAULT: 'var(--radius)',
        md: 'calc(var(--radius) * 1.25)',
        lg: 'calc(var(--radius) * 1.5)',
        xl: 'calc(var(--radius) * 2)',
      },
      fontFamily: {
        shrikhand: ['var(--font-shrikhand)'],
        inter: ['var(--font-inter)'],
        playfair: ['var(--font-playfair)'],
      },
    },
  },
  plugins: [
    // Plugins para Tailwind v4.1
    forms,
    typography,
  ],
};

export default config;
