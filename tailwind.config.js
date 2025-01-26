// tailwind.config.js
const tailwindConfig = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)', // Ensure you have this custom property defined
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;