/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ultra-fast development config - minimal scanning
  content: [
    "./src/app/components/**/*.ts",
    "./src/app/app.component.ts"
  ],
  darkMode: "class",
  
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  
  plugins: [],
  
  // Include ALL classes in development to avoid missing styles
  safelist: [
    {
      pattern: /.*/,
    },
  ],
  
  // Minimal core plugins for development
  corePlugins: {
    preflight: true,
    // Enable everything for development to avoid issues
  }
}