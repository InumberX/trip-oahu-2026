import { PAGES, type PageId } from '~/config/pages'
import { type Lang } from '~/types/lang'
import { getLangRoute } from '~/utils/lang'
import { getDictionary } from '~/utils/locale'

type RouteConfig = {
  id: PageId
  getName: (lang: Lang) => string
  getUrl: (lang: Lang) => string
}

// Cloudflare の ASSETS 配信ではサイトが常にドメイン直下に載り、404ページは任意の
// 深さのパスで返る。相対パスではなくルート絶対パスで統一する。
export const routes: { [K in PageId]: RouteConfig } = {
  TOAHU2026_10_100: {
    id: PAGES.TOAHU2026_10_100.id,
    getName: (lang) => getDictionary(lang, 'pages/TOAHU2026_10_100').name,
    getUrl: (lang) => `${getLangRoute(lang)}${PAGES.TOAHU2026_10_100.path}`,
  },
  TOAHU2026_20_100: {
    id: PAGES.TOAHU2026_20_100.id,
    getName: (lang) => getDictionary(lang, 'pages/TOAHU2026_20_100').name,
    getUrl: (lang) => `${getLangRoute(lang)}${PAGES.TOAHU2026_20_100.path}`,
  },
}

// ヘッダーのグローバルナビに並べる順序
export const globalNavRoutes: RouteConfig[] = [
  routes.TOAHU2026_10_100,
  routes.TOAHU2026_20_100,
]
