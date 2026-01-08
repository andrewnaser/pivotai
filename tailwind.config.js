/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0 0% 5%)',
        foreground: 'hsl(0 0% 98%)',
        card: {
          DEFAULT: 'hsl(0 0% 8%)',
          foreground: 'hsl(0 0% 98%)',
        },
        popover: {
          DEFAULT: 'hsl(0 0% 8%)',
          foreground: 'hsl(0 0% 98%)',
        },
        primary: {
          DEFAULT: 'hsl(177 70% 50%)', // Cyan
          foreground: 'hsl(0 0% 5%)',
        },
        secondary: {
          DEFAULT: 'hsl(240 5% 15%)',
          foreground: 'hsl(0 0% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(240 5% 15%)',
          foreground: 'hsl(240 5% 65%)',
        },
        accent: {
          DEFAULT: 'hsl(280 70% 60%)', // Purple
          foreground: 'hsl(0 0% 5%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 84% 60%)',
          foreground: 'hsl(0 0% 98%)',
        },
        success: {
          DEFAULT: 'hsl(142 71% 45%)', // Green
          foreground: 'hsl(0 0% 98%)',
        },
        warning: {
          DEFAULT: 'hsl(45 93% 47%)', // Gold/Yellow
          foreground: 'hsl(0 0% 5%)',
        },
        // Money/Profit colors
        profit: {
          DEFAULT: 'hsl(142 71% 45%)', // Green
          light: 'hsl(142 71% 60%)',
          dark: 'hsl(142 71% 35%)',
        },
        gold: {
          DEFAULT: 'hsl(45 93% 47%)',
          light: 'hsl(45 93% 60%)',
          dark: 'hsl(45 93% 35%)',
        },
        neon: {
          cyan: 'hsl(177 70% 50%)',
          purple: 'hsl(280 70% 60%)',
          pink: 'hsl(330 70% 60%)',
          blue: 'hsl(220 70% 60%)',
          green: 'hsl(142 71% 45%)',
        },
        border: 'hsl(240 5% 20%)',
        input: 'hsl(240 5% 20%)',
        ring: 'hsl(177 70% 50%)',
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'rainbow': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        'glow': {
          '0%, 100%': { 
            'box-shadow': '0 0 20px rgba(45, 212, 191, 0.3), 0 0 40px rgba(168, 85, 247, 0.2)'
          },
          '50%': { 
            'box-shadow': '0 0 40px rgba(45, 212, 191, 0.5), 0 0 60px rgba(168, 85, 247, 0.4)'
          },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'rainbow': 'rainbow 3s ease infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'money-gradient': 'linear-gradient(135deg, #10b981 0%, #f59e0b 50%, #10b981 100%)',
        'profit-gradient': 'linear-gradient(135deg, #2dd4bf 0%, #a855f7 50%, #ec4899 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 33%, #ec4899 66%, #06b6d4 100%)',
      },
    },
  },
  plugins: [],
}
