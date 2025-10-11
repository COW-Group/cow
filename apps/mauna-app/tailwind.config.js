/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "xs": "475px",
        "2xl": "1400px",
      },
    },
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom brand colors
        "cream-25": "hsl(var(--cream-25))",
        "cream-50": "hsl(var(--cream-50))",
        "cream-100": "hsl(var(--cream-100))",
        "cream-200": "hsl(var(--cream-200))",
        "cream-300": "hsl(var(--cream-300))",
        "cream-400": "hsl(var(--cream-400))",
        "cream-500": "hsl(var(--cream-500))",
        "cream-600": "hsl(var(--cream-600))",
        "cream-700": "hsl(var(--cream-700))",
        "cream-800": "hsl(var(--cream-800))",
        "cream-900": "hsl(var(--cream-900))",
        "ink-50": "hsl(var(--ink-50))",
        "ink-100": "hsl(var(--ink-100))",
        "ink-200": "hsl(var(--ink-200))",
        "ink-300": "hsl(var(--ink-300))",
        "ink-400": "hsl(var(--ink-400))",
        "ink-500": "hsl(var(--ink-500))",
        "ink-600": "hsl(var(--ink-600))",
        "ink-700": "hsl(var(--ink-700))",
        "ink-800": "hsl(var(--ink-800))",
        "ink-900": "hsl(var(--ink-900))",
        "ink-950": "hsl(var(--ink-950))",
        "logo-blue": "hsl(var(--logo-blue))",
        "soft-gold": "hsl(var(--soft-gold))",
        "brushed-silver": "hsl(var(--brushed-silver))",
        "sage-50": "hsl(var(--sage-50))",
        "sage-100": "hsl(var(--sage-100))",
        "sage-200": "hsl(var(--sage-200))",
        "sage-300": "hsl(var(--sage-300))",
        "sage-400": "hsl(var(--sage-400))",
        "sage-500": "hsl(var(--sage-500))",
        "sage-600": "hsl(var(--sage-600))",
        "sage-700": "hsl(var(--sage-700))",
        "sage-800": "hsl(var(--sage-800))",
        "sage-900": "hsl(var(--sage-900))",
        "moss-50": "hsl(var(--moss-50))",
        "moss-100": "hsl(var(--moss-100))",
        "moss-200": "hsl(var(--moss-200))",
        "moss-300": "hsl(var(--moss-300))",
        "moss-400": "hsl(var(--moss-400))",
        "moss-500": "hsl(var(--moss-500))",
        "moss-600": "hsl(var(--moss-600))",
        "moss-700": "hsl(var(--moss-700))",
        "moss-800": "hsl(var(--moss-800))",
        "moss-900": "hsl(var(--moss-900))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // Updated font families to use CSS variables
        inter: ["var(--font-inter)"],
        montserrat: ["var(--font-montserrat)"], // Primary
        barlow: ["var(--font-barlow)"], // Secondary
        caveat: ["var(--font-caveat)"], // Tertiary (handwritten)
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "sunlight-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsla(var(--logo-blue), 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px hsla(var(--logo-blue), 0.5), 0 0 60px hsla(var(--soft-gold), 0.2)",
          },
        },
        "rotate-toggle": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(180deg)",
          },
        },
        "slide-in-left": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "sunlight-glow": "sunlight-glow 4s ease-in-out infinite",
        "rotate-toggle": "rotate-toggle 0.3s ease-in-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
      },
      backdropBlur: {
        xs: "2px",
      },
      mixBlendMode: {
        destinationOut: "destination-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Chrome, Safari and Opera */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      })
    },
  ],
}
