/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--sidebar-border, 214.3 31.8% 91.4%))',
        background: 'hsl(var(--background, 0 0% 100%))',
        foreground: 'hsl(var(--foreground, 222.2 84% 4.9%))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background, 0 0% 100%))',
          foreground: 'hsl(var(--sidebar-foreground, 222.2 84% 4.9%))',
          primary: 'hsl(var(--sidebar-primary, 222.2 47.4% 11.2%))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground, 210 40% 98%))',
          accent: 'hsl(var(--sidebar-accent, 210 40% 96.1%))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground, 222.2 47.4% 11.2%))',
          border: 'hsl(var(--sidebar-border, 214.3 31.8% 91.4%))',
          ring: 'hsl(var(--sidebar-ring, 215 20.2% 65.1%))',
        },
      },
    },
  },
  plugins: [],
}