/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brown: {
          900: '#3D2914',
        },
        red: {
          900: '#5C1D1D',
        },
        golden: '#B8860B',
        parchment: '#F5E6D3',
      },
      fontFamily: {
        medieval: ['MedievalSharp', 'cursive'],
        serif: ['Crimson Text', 'serif'],
      },
      borderWidth: {
        3: '3px',
      },
      boxShadow: {
        medieval: '0 4px 14px rgba(184, 134, 11, 0.2)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      backgroundImage: {
        'parchment-texture': "url('/src/assets/parchment-bg.png')",
      },
    },
  },
  plugins: [],
}
