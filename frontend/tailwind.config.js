/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
        },
        background: '#0C0C0F',
        surface: {
          DEFAULT: '#16161A',
          elevated: '#1C1C21',
          hover: '#222228',
        },
        border: {
          DEFAULT: '#2A2A30',
          light: '#35353D',
        },
        text: {
          DEFAULT: '#EFEFEF',
          secondary: '#B0B0B8',
          muted: '#6B6B76',
        },
        success: '#22C55E',
        warning: '#EAB308',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '8px',
        lg: '10px',
        xl: '14px',
        '2xl': '18px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.4)',
        DEFAULT: '0 2px 6px rgba(0,0,0,0.4)',
        md: '0 4px 12px rgba(0,0,0,0.45)',
        lg: '0 8px 24px rgba(0,0,0,0.5)',
        glow: '0 0 20px rgba(99,102,241,0.2)',
      },
    },
  },
  plugins: [],
};
