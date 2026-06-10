/** @type {import('tailwindcss').Config} */
/* eslint-disable @typescript-eslint/no-require-imports -- config Tailwind/NativeWind en CommonJS */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
}
