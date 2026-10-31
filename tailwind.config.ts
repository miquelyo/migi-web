import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI Variable"', '"Segoe UI"',
          'Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif',
        ],
      },
      colors: {
        notch: '#070707',
        ink: '#050505',
      },
    },
  },
  plugins: [],
};

export default config;
