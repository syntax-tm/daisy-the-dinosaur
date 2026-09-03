const __filename = import.meta.filename;
const __dirname = import.meta.dirname;

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      config: './tailwind.config.ts',
    },
    'postcss-import': {},
    //'tailwindcss': {},
    'autoprefixer': {},
    // autoprefixer: {},
  },
};

export default config;
