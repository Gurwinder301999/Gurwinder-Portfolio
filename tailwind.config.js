/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
      },
      colors: {
        ink: '#0C0C0C',
        frost: '#D7E2EA',
        steel: '#646973',
        // Base accent (fills, gradients, borders) and a brightened variant for
        // icons and small text: #B600A8 is only 3.3:1 on #0C0C0C, while this
        // reaches 5.1:1 and stays in the same magenta family.
        magenta: '#B600A8',
        'magenta-bright': '#D14AC0',
        violet: {
          glow: '#7621B0',
        },
      },
      keyframes: {
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'orbit-x': {
          from: { transform: 'rotateX(0deg) rotateY(0deg)' },
          to: { transform: 'rotateX(360deg) rotateY(360deg)' },
        },
        'grid-flow': {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '0 -600px' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -14px, 0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.06)' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 22s linear infinite',
        'orbit-x': 'orbit-x 26s linear infinite',
        'grid-flow': 'grid-flow 3.5s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
