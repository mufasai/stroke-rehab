/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#F1FAE6',
          100: '#E2F5D1',
          200: '#C6EBAB',
          300: '#A4DC7B',
          400: '#8EBD55',
          500: '#4D8343',
          600: '#34613A',
          700: '#2A5030',
          800: '#1F3D24',
          900: '#152A19',
          950: '#0A160C',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: '#F3F7F7',
          100: '#E4EDEE',
          200: '#CBDBDD',
          300: '#A7C2C5',
          400: '#7DA2A7',
          500: '#5A7A7E',
          600: '#476367',
          700: '#394F52',
          800: '#314245',
          900: '#2A383A',
          950: '#001B1A',
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Direct Rukana token aliases
        desa: {
          black: '#001B1A',
          secondary: '#5A7A7E',
          'dark-green': '#34613A',
          'soft-green': '#8EBD55',
          foreshadow: '#F1FAE6',
          yellow: '#FBAD4A',
          orange: '#FA7139',
          background: '#F2F9F6',
          blue: '#005CAA',
          red: '#FF5070',
          grey: '#DBDBDB',
          lime: '#DEFF6E',
        },
        // Medical UI semantic colors
        success: {
          DEFAULT: '#8EBD55',
          light: '#A8D080',
          dark: '#6A9A3A',
        },
        warning: {
          DEFAULT: '#FBAD4A',
          light: '#FFC670',
          dark: '#E09030',
        },
        error: {
          DEFAULT: '#FF5070',
          light: '#FF7A92',
          dark: '#E03050',
        },
        info: {
          DEFAULT: '#005CAA',
          light: '#3384C4',
          dark: '#004080',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Lexend Deca', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
