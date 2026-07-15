import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sport: {
          dark: 'var(--color-sport-dark)',
          card: 'var(--color-sport-card)',
          border: 'var(--color-sport-border)',
          orange: 'var(--color-sport-orange)',
          blue: 'var(--color-sport-blue)',
          lime: 'var(--color-sport-lime)',
          gray: 'var(--color-sport-gray)',
          fg: 'var(--color-sport-fg)',
          'gray-light': 'var(--color-sport-gray-light)',
        },
        'footer-bg': 'var(--color-footer-bg)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
