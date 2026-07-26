import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest-env.ts'],
    includeSource: ['src/**/*.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
  },
  resolve: {
    // tsconfig.jsonのpaths（~/）をVite標準機能で解決する
    tsconfigPaths: true,
  },
  // minista.config.ts の define と揃える（テストからも ~/config/env を解決させる）
  define: {
    'import.meta.env.VITE_NODE_ENV': '"test"',
    // 空にしてインデックス許可時の分岐（hreflang出力）をテストできるようにする。
    // ページ単位の noindex は metadata の noindex で検証する。
    'import.meta.env.VITE_NO_INDEX': '""',
    'import.meta.env.VITE_SITE_URL': '"http://localhost:5173"',
    'import.meta.env.VITE_SITE_NAME': '"Trip Oahu 2026(test)"',
    'import.meta.env.VITE_GOOGLE_ANALYTICS_ID': '""',
    'import.meta.env.VITE_CACHE_BUSTER': '"ver=test"',
    'import.meta.env.VITE_LASTMOD': '"2026-01-01T00:00:00+09:00"',
  },
  plugins: [react()],
})
