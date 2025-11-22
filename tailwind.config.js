// tailwind.config.js - SYNTAXE CORRIGÉE (CommonJS)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Inter comme police par défaut
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        // Poppins comme police alternative
        poppins: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        // Ou vice versa si vous préférez Poppins par défaut
        // sans: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
        // inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        orange: {
          100: '#fed7aa',
          400: '#fb923c',
          500: '#f97316',
        },
        teal: {
          100: '#ccfbf1',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        }
      },
    },
  },
  plugins: [],
}