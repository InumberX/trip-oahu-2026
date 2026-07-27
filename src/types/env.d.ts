// minista.config.ts の define で埋め込まれる。実行時に .env を読むわけではない。
interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string
  readonly VITE_NO_INDEX: string
  readonly VITE_SITE_URL: string
  readonly VITE_SITE_NAME: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  readonly VITE_CACHE_BUSTER: string
  readonly VITE_LASTMOD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
