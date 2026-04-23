/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#f5e6c8',
        'parchment-dark': '#e8d4a0',
        'hq-brown': '#3d1c02',
        'hq-dark': '#1a0a00',
        'hq-red': '#8b1a1a',
        'hq-gold': '#c9a227',
        'hq-silver': '#a8a9ad',
        't1-legendary': '#ff6b00',
        't2-relic': '#9b59b6',
        't3-epic': '#3498db',
        't4-base': '#7f8c8d',
      },
      fontFamily: {
        medieval: ['"MedievalSharp"', '"Cinzel"', 'Georgia', 'serif'],
        body: ['"Crimson Text"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card-glow-t1': '0 0 20px rgba(255,107,0,0.5)',
        'card-glow-t2': '0 0 20px rgba(155,89,182,0.5)',
        'card-glow-t3': '0 0 20px rgba(52,152,219,0.4)',
      }
    },
  },
  plugins: [],
}
