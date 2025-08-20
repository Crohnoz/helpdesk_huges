// postcss.config.js (robust ESM)
// Works out of the box with Vite. Keeps Tailwind + Autoprefixer.
// Uses function form so PostCSS can pass context (env, map, etc.).

import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default (ctx) => ({
  // Preserve source maps when Vite asks for them
  map: ctx?.options?.map,
  plugins: [
    tailwindcss(),
    autoprefixer(),
    // Optional: add cssnano in production for extra minification
    // ...(ctx.env === 'production' ? [ (await import('cssnano')).default({ preset: 'default' }) ] : [])
  ],
})
