/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#071A3D',
          deep: '#121258',
          dark: '#191B23',
          card: '#1C1F2A',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: 'rgba(212, 175, 55, 0.12)',
          border: 'rgba(212, 175, 55, 0.3)',
          hover: '#C29B27',
        },
        accent: {
          green: '#20900C',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        hanken: ['"Hanken Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(212, 175, 55, 0.25)',
        'luxury': '0px 10px 30px 0px rgba(7, 26, 61, 0.15)',
      }
    },
  },
  plugins: [],
}
