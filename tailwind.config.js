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
        pottery: {
          sand: '#FED7AA',     // Warm sandy orange
          clay: '#F59E0B',     // Vibrant amber
          terracotta: '#EA580C', // Bright orange
          earth: '#92400E',    // Deep brown
          desert: '#FFFBEB',   // Light cream
          olive: '#84CC16',    // Fresh lime green
        },
      },
      fontFamily: {
        arabic: ['var(--font-arabic)', 'sans-serif'],
        english: ['var(--font-english)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-pottery': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FEF3C7 0%, #FED7AA 50%, #FDBA74 100%)',
      },
      boxShadow: {
        'pottery': '0 10px 40px -10px rgba(245, 158, 11, 0.4)',
        'pottery-lg': '0 20px 60px -15px rgba(245, 158, 11, 0.5)',
      },
    },
  },
  plugins: [],
}
