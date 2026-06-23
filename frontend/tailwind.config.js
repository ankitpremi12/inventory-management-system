/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#0f172a',
          card:    '#1e293b',
          elevated:'#263548',
          border:  '#334155',
        },
      },
      boxShadow: {
        'glow-teal':   '0 0 20px rgba(20, 184, 166, 0.25)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.25)',
        'card':        '0 4px 24px rgba(0,0,0,0.4)',
        'modal':       '0 25px 50px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in':   'fadeIn 0.5s ease-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'float':     'float 6s ease-in-out infinite',
        'shimmer':   'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      },
    },
  },
  daisyui: {
    themes: [
      {
        ims: {
          "primary":   "#14b8a6",
          "secondary": "#8b5cf6",
          "accent":    "#06b6d4",
          "neutral":   "#1e293b",
          "base-100":  "#0f172a",
          "base-200":  "#1e293b",
          "base-300":  "#263548",
          "info":      "#06b6d4",
          "success":   "#10b981",
          "warning":   "#f59e0b",
          "error":     "#f43f5e",
        },
      },
    ],
    darkTheme: "ims",
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('daisyui'),
  ],
};
