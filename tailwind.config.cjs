/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        forgotpassword: "url('/public/img/ForgostPassword.jpg')",
        resetpassword: "url('/public/img/resetpassword.jpg')",
      },
      fontFamily: {
        Inter: ['Inter'],
      },
      colors: {
        'dashboard-rgb': 'rgba(255, 255, 255, 0.7)',
        'dashboard-title': '#818CF8',
        'dashboard-text': '#9CA3AF',
        'dashboard-hover': '#29303D',
        'dashboard-main': '#111827',
      },
    },
  },
  plugins: [],
};
