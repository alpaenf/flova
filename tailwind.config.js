/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
        },
        primary: {
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          dark: '#1D4ED8',
          50: '#EFF6FF',
          100: '#DBEAFE',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FCA5A5',
          50: '#FEF2F2',
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#86EFAC',
          50: '#F0FDF4',
        },
        warning: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F8FAFC',
          hover: '#F1F5F9',
        },
        border: {
          DEFAULT: '#E2E8F0',
          light: '#F1F5F9',
        },
        text: {
          DEFAULT: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
