/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#272829',
          deep: '#173b6c',
          dark: '#040b14',
        },
        sidebar: {
          DEFAULT: '#040b14',
          ring: '#2c2f3f',
          social: '#212431',
        },
        accent: {
          DEFAULT: '#149ddd',
          hover: '#2eafec',
          dark: '#0e7bb0',
          light: '#37b3ed',
        },
        bar: {
          track: '#ecedf2',
        },
      },
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', 'sans-serif'],
        heading: ['Raleway', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '1140px',
      },
      spacing: {
        sidebar: '300px',
      },
      animation: {
        'fade-in': 'fadeIn 600ms ease-out both',
        'fade-up': 'fadeUp 600ms ease-out both',
        'fade-right': 'fadeRight 600ms ease-out both',
        'fade-left': 'fadeLeft 600ms ease-out both',
        blink: 'blink 1s steps(1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeRight: {
          '0%': { opacity: 0, transform: 'translateX(-24px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        fadeLeft: {
          '0%': { opacity: 0, transform: 'translateX(24px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        blink: { '0%, 50%': { opacity: 1 }, '50.01%, 100%': { opacity: 0 } },
      },
    },
  },
  plugins: [],
};
