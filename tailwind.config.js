module.exports = {
<<<<<<< HEAD
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      colors: {
        accent: '#7c3aed',
        'accent-light': '#a78bfa',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
=======
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        accent: 'var(--accent-color)',
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
<<<<<<< HEAD
};
=======
}
>>>>>>> 609a6013bbb628b69c5b96e26dd98e9488525919
