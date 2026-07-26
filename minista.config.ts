import {
  defineConfig,
  pluginBeautify,
  pluginEntry,
  pluginImage,
  pluginSsg,
} from 'minista'
import { loadEnv } from 'vite'

import { parseBooleanEnv } from './plugins/env'
import { pluginRobots } from './plugins/robots'
import { pluginSitemap } from './plugins/sitemap'
import { pluginTrailingSlash } from './plugins/trailing-slash'

// CSS・画像・フォントを種類ごとに別ディレクトリへ出力する
// （pluginEntry経由のアセット名はソースパスを含むためbasenameに正規化する）
const assetFileNames = (assetInfo: { name?: string }) => {
  const name = assetInfo.name ?? ''
  const fileName = name.substring(name.lastIndexOf('/') + 1) || name
  if (name.endsWith('.css')) {
    return `assets/css/${fileName}`
  }
  if (/\.(png|jpe?g|gif|bmp|svg|webp|avif)$/.test(name)) {
    return `assets/img/${fileName}`
  }
  if (/\.(woff2?|ttf|otf|eot)$/.test(name)) {
    return `assets/font/${fileName}`
  }
  return `assets/${fileName}`
}

// ローカルビルド（npm run deploy-* など）は .env.<env>.local を読む。
// CLOUDFLARE_ENV はデプロイ先を表し、素の npm run dev / build では NODE_ENV に
// フォールバックする。CIがワークフローから注入する値を優先するため
// process.env を後勝ちにする。
const envMode =
  process.env.CLOUDFLARE_ENV || process.env.NODE_ENV || 'development'
const fileEnv = loadEnv(envMode, process.cwd(), '')
const env = { ...fileEnv, ...process.env }

const now = new Date()
const pad = (value: number) => String(value).padStart(2, '0')
const CACHE_BUSTER = `ver=${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
const LASTMOD = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}+09:00`

// 未設定時のフォールバックは Vite 既定のdevサーバー（minista はポートを上書きしない）
const SITE_URL = env.SITE_URL || 'http://localhost:5173'
// 'false' / '0' などの否定表記も false として解釈する（plugins/env.ts 参照）
const NO_INDEX = parseBooleanEnv(env.NO_INDEX)

export default defineConfig(({ command, isSsrBuild }) => {
  // 通常ビルド（SSRビルドと切り分ける）
  const isBuild = command === 'build' && !(isSsrBuild ?? false)

  return {
    // 404ページは任意の深さのパスで配信されるため、相対パス（'./'）ではなく
    // ルート絶対パスで出力する必要がある。
    base: '/',
    plugins: [
      pluginSsg(),
      pluginEntry(),
      pluginImage({ optimize: { outName: '[name]' } }),
      pluginBeautify({ src: ['**/*.{html,css,js}'] }),
      pluginSitemap({ siteUrl: SITE_URL, lastmod: LASTMOD, outDir: 'dist' }),
      pluginRobots({
        siteUrl: SITE_URL,
        noIndex: NO_INDEX,
        outDir: 'dist',
      }),
      pluginTrailingSlash(),
    ],
    resolve: {
      // tsconfig.jsonのpaths（~/）をVite標準機能で解決する
      tsconfigPaths: true,
    },
    // ビルド時に埋め込む。Viteが .env から自動公開するのは VITE_ 接頭辞の値だけで、
    // process.env 由来の値は対象外のため、CIが注入する変数はここで明示する。
    define: {
      'import.meta.env.VITE_NODE_ENV': `"${env.NODE_ENV || 'development'}"`,
      // アプリ側は Boolean(NO_INDEX) で判定するため、正規化した '1' / '' を渡す
      'import.meta.env.VITE_NO_INDEX': NO_INDEX ? "'1'" : "''",
      'import.meta.env.VITE_SITE_URL': `"${SITE_URL}"`,
      'import.meta.env.VITE_SITE_NAME': `"${env.SITE_NAME || 'Trip Oahu 2026(development)'}"`,
      'import.meta.env.VITE_GOOGLE_ANALYTICS_ID': `"${env.GOOGLE_ANALYTICS_ID || 'G-318FZ1QLCS'}"`,
      'import.meta.env.VITE_CACHE_BUSTER': `"${CACHE_BUSTER}"`,
      'import.meta.env.VITE_LASTMOD': `"${LASTMOD}"`,
    },
    server: {
      host: true,
    },
    build: {
      outDir: isBuild ? 'dist' : undefined,
      // SSRビルドを壊さないよう、出力設定は通常ビルド時のみ適用する
      ...(isBuild
        ? {
            rolldownOptions: {
              output: {
                assetFileNames,
                chunkFileNames: 'assets/js/[name].js',
                entryFileNames: 'assets/js/[name].js',
              },
            },
          }
        : {}),
    },
  }
})
