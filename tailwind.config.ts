import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5ed',
          100: '#ffe7d3',
          200: '#ffcaa6',
          300: '#ffa56e',
          400: '#ff7635',
          500: '#ff530d', // primary
          600: '#f03904',
          700: '#c72706',
          800: '#9e220d',
          900: '#7f1f0e',
        },
      },
      fontFamily: {
        display: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
