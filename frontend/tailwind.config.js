/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#B85C38',
        'primary-dark': '#9A4A2C',
        secondary: '#2D3A2E',
        'secondary-light': '#3D4A3E',
        cream: '#FAF6F1',
        'cream-dark': '#F0EBE3',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
