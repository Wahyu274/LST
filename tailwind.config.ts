import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#071426',
          900: '#0B1F3A',
          800: '#112B50',
          700: '#1A3B69',
        },
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2F80ED',
          600: '#1769E0', // Main Corporate Blue Action
          700: '#1255B8',
          800: '#104494',
          900: '#0E3674',
        },
        // Backward compatibility brand alias to primary-600
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#2F80ED',
          600: '#1769E0',
          700: '#1255B8',
          800: '#104494',
          900: '#071426',
        },
        surface: '#FFFFFF',
        bg: '#F7F9FC',
        border: '#E2E8F0',
        semantic: {
          success: '#16A36A',
          warning: '#D99A16',
          danger: '#D64545',
          info: '#1769E0',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-manrope)', 'Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        btn: '8px',
        input: '8px',
        card: '10px',
        modal: '12px',
        badge: '6px',
      },
      maxWidth: {
        'content': '1240px',
      }
    },
  },
  plugins: [],
};
export default config;
