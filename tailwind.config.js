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
        'emf-ivory':    '#FAF7F2',
        'emf-white':    '#FFFFFF',
        'emf-black':    '#0a0a0a',
        'emf-pink':     '#F2A7BB',
        'emf-pink-lt':  '#F8C9D6',
        'emf-pink-dk':  '#E0789A',
        'emf-muted':    '#888888',
        'emf-border':   '#E8E0D8',
        'emf-surface':  '#F5F0EA',
      },
      fontFamily: {
        script:   ['var(--font-pinyon)',    'cursive'],
        display:  ['var(--font-playfair)',  'Georgia', 'serif'],
        sans:     ['var(--font-playfair)',  'Georgia', 'serif'],
      },
      animation: {
        'marquee-slow': 'marquee 40s linear infinite',
        'marquee-fast': 'marquee 25s linear infinite',
        'marquee':      'marquee 35s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'card': '0 2px 20px rgba(0,0,0,0.07)',
        'card-hover': '0 6px 30px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
