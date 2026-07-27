import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    // tsconfig.jsonのpaths（~/）をVite標準機能で解決する
    tsconfigPaths: true,
  },
  // minista.config.ts の define と揃える（Storybookはminista設定を読まない）
  define: {
    'import.meta.env.VITE_NODE_ENV': '"development"',
    'import.meta.env.VITE_NO_INDEX': '"1"',
    'import.meta.env.VITE_SITE_URL': '"http://localhost:5173"',
    'import.meta.env.VITE_SITE_NAME': '"Trip Oahu 2026(storybook)"',
    'import.meta.env.VITE_GOOGLE_ANALYTICS_ID': '""',
    'import.meta.env.VITE_CACHE_BUSTER': '"ver=storybook"',
    'import.meta.env.VITE_LASTMOD': '"2026-01-01T00:00:00+09:00"',
  },
})
