/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FFFFFF',
        'primary-bg': '#FFFFFF',
        'secondary-bg': '#F8F8F8',
        'card-bg': '#FFFFFF',
        'accent': '#FFD400',
        'accent-dark': '#E6BF00',
        'heading': '#111111',
        'body': '#444444',
        'body-light': '#777777',
        'border': '#111111',
        'border-light': '#DDDDDD',
        'card-red': '#FF4D4D',
        'card-blue': '#4D7AFF',
        'card-purple': '#8B5CF6',
        'card-green': '#10B981',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-lg': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      boxShadow: {
        'brutal': '6px 6px 0px #111111',
        'brutal-sm': '3px 3px 0px #111111',
        'brutal-hover': '8px 8px 0px #111111',
        'brutal-accent': '6px 6px 0px #FFD400',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'dash': 'dash 20s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'paper-plane': 'paper-plane 3s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        dash: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        'paper-plane': {
          '0%': { transform: 'translateX(-100%) translateY(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateX(100vw) translateY(-100px) rotate(15deg)', opacity: '0' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
