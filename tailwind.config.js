/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Navy theme
        navy: {
          950: '#020b18',
          900: '#040f22',
          800: '#071630',
          700: '#0d2040',
          600: '#1a3a60',
        },
        // Neon accents
        neon: {
          DEFAULT: '#00d4ff',
          light: '#00ffcc',
          cyan: '#00d4ff',
        },
        // Status colors
        orange: {
          DEFAULT: '#ff6b35',
          light: '#ffaa44',
        },
        // Glass morphism backgrounds
        glass: {
          bg: 'rgba(7, 22, 48, 0.72)',
          bg2: 'rgba(13, 32, 64, 0.55)',
          border: 'rgba(0, 180, 255, 0.16)',
          border2: 'rgba(0, 180, 255, 0.08)',
        },
        // Text colors
        text: {
          100: '#e8f4ff',
          200: '#b0cfe8',
          400: '#5a8aaa',
          600: '#2a4a6a',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(0, 212, 255, 0.2)',
        'glow': '0 0 24px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
