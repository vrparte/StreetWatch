// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f9ff',
          // ... other shades
          900: '#1e3a8a',
        },
        purple: {
          50: '#faf5ff',
          // ... other shades
          900: '#4c1d95',
        },
      },
    },
  },
  plugins: [],
};