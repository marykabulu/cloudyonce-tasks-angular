const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  plugins: {
    tailwindcss: {
      config: isDev ? './tailwind.dev.config.js' : './tailwind.config.js'
    },
    autoprefixer: {},
  },
}
