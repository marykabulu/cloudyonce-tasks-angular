/** @type {import('tailwindcss').Config} */
module.exports = {
  // Optimized content scanning - only scan component files
  content: [
    "./src/app/components/**/*.ts",
    "./src/app/app.component.ts",
    "./src/index.html"
  ],
  darkMode: "class",

  // Limit the color palette to only what you use
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
      // Limit spacing scale to commonly used values
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '24': '6rem',
      }
    },
  },

  plugins: [],

  // Safelist commonly used dynamic classes
  safelist: [
    // Dynamic color classes
    'text-green-600', 'text-orange-600', 'text-purple-600', 'text-red-600', 'text-blue-600',
    'bg-green-100', 'bg-red-100', 'bg-blue-100', 'bg-yellow-100', 'bg-purple-100', 'bg-gray-100',
    'bg-green-900', 'bg-red-900', 'bg-blue-900', 'bg-yellow-900', 'bg-purple-900', 'bg-gray-900',
    'text-green-800', 'text-red-800', 'text-blue-800', 'text-yellow-800', 'text-purple-800', 'text-gray-800',
    'text-green-200', 'text-red-200', 'text-blue-200', 'text-yellow-200', 'text-purple-200', 'text-gray-200',
    'border-green-200', 'border-red-200', 'border-blue-200', 'border-yellow-200', 'border-purple-200',
    'border-green-800', 'border-red-800', 'border-blue-800', 'border-yellow-800', 'border-purple-800',
    // Dynamic spacing
    'h-2', 'w-32', 'w-8', 'w-6', 'h-6', 'w-4', 'h-4', 'w-11', 'h-5', 'w-5',
    // Animation classes
    'animate-spin',
    // Hover states
    'hover:bg-accent', 'hover:text-foreground', 'hover:bg-primary/90', 'hover:bg-secondary/80',
    // Cursor utilities
    'cursor-pointer', 'cursor-not-allowed', 'cursor-default',
    // Line clamp
    'line-clamp-2',
    // Responsive classes
    'md:flex', 'md:grid-cols-3', 'md:grid-cols-4', 'lg:grid-cols-2', 'sm:flex-row', 'sm:items-center'
  ],

  // Aggressive performance optimizations
  corePlugins: {
    // Keep only the features you actually use
    preflight: true,

    // Layout
    container: false,
    display: true,
    float: false,
    clear: false,
    isolation: false,
    objectFit: false,
    objectPosition: false,
    overflow: true,
    overscrollBehavior: false,
    position: true,
    inset: true,
    visibility: true,
    zIndex: true,

    // Flexbox & Grid
    flexBasis: true,
    flexDirection: true,
    flexWrap: true,
    flex: true,
    flexGrow: true,
    flexShrink: true,
    order: false,
    gridTemplateColumns: true,
    gridColumn: false,
    gridColumnStart: false,
    gridColumnEnd: false,
    gridTemplateRows: false,
    gridRow: false,
    gridRowStart: false,
    gridRowEnd: false,
    gridAutoFlow: false,
    gridAutoColumns: false,
    gridAutoRows: false,
    gap: true,

    // Spacing
    padding: true,
    margin: true,
    space: true,

    // Sizing
    width: true,
    minWidth: true,
    maxWidth: true,
    height: true,
    minHeight: true,
    maxHeight: true,

    // Typography
    fontFamily: false,
    fontSize: true,
    fontSmoothing: false,
    fontStyle: false,
    fontVariantNumeric: false,
    fontWeight: true,
    letterSpacing: false,
    lineHeight: true,
    listStyleImage: false,
    listStylePosition: false,
    listStyleType: false,
    textAlign: true,
    textColor: true,
    textDecoration: true,
    textDecorationColor: false,
    textDecorationStyle: false,
    textDecorationThickness: false,
    textUnderlineOffset: false,
    textTransform: false,
    textOverflow: true,
    textIndent: false,
    verticalAlign: false,
    whitespace: true,
    wordBreak: false,
    hyphens: false,
    content: false,

    // Backgrounds
    backgroundAttachment: false,
    backgroundClip: false,
    backgroundColor: true,
    backgroundOrigin: false,
    backgroundPosition: false,
    backgroundRepeat: false,
    backgroundSize: false,
    backgroundImage: false,
    gradientColorStops: false,

    // Borders
    borderRadius: true,
    borderWidth: true,
    borderColor: true,
    borderStyle: false,
    divideWidth: false,
    divideColor: false,
    divideStyle: false,
    borderCollapse: false,
    borderSpacing: false,
    tableLayout: false,
    caption: false,

    // Effects
    boxShadow: false,
    boxShadowColor: false,
    opacity: true,
    mixBlendMode: false,
    backgroundBlendMode: false,

    // Filters (all disabled for performance)
    blur: false,
    brightness: false,
    contrast: false,
    dropShadow: false,
    grayscale: false,
    hueRotate: false,
    invert: false,
    saturate: false,
    sepia: false,
    filter: false,
    backdropBlur: false,
    backdropBrightness: false,
    backdropContrast: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
    backdropFilter: false,

    // Tables
    borderCollapse: false,
    borderSpacing: false,
    tableLayout: false,

    // Transitions & Animation
    transitionProperty: true,
    transitionDelay: false,
    transitionDuration: true,
    transitionTimingFunction: false,
    animation: false,

    // Transforms
    transform: false,
    transformOrigin: false,
    scale: false,
    rotate: false,
    translate: false,
    skew: false,

    // Interactivity
    appearance: false,
    cursor: true,
    outline: false,
    outlineColor: false,
    outlineOffset: false,
    outlineStyle: false,
    outlineWidth: false,
    pointerEvents: false,
    resize: false,
    scrollBehavior: false,
    scrollMargin: false,
    scrollPadding: false,
    scrollSnapAlign: false,
    scrollSnapStop: false,
    scrollSnapType: false,
    touchAction: false,
    userSelect: false,
    willChange: false,

    // SVG
    fill: false,
    stroke: false,
    strokeWidth: false,

    // Accessibility
    accessibility: false,
  },

  // Additional performance settings
  future: {
    hoverOnlyWhenSupported: true,
  },

  // Experimental features for better performance
  experimental: {
    optimizeUniversalDefaults: true,
  }
}