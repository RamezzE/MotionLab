/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens : {
      'xs' : '525px',
      'sm' : '625px',
      'md' : '768px',
      'lg' : '976px',
      'xl' : '1440px',
    },
    extend: {
      colors: {
        // primary: '#FFF',
        // secondary: '#51bfff',
        // bgColor: '#222222'
      },
    },
  },
  plugins: [],
}