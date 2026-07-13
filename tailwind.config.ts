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
          orange: '#FF4500',
          blue: '#2563EB',
          lime: '#A3FF00',
          gray: 'var(--color-sport-gray)',
          fg: 'var(--color-sport-fg)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
