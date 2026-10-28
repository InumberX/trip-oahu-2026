// このモジュールは minista.config.ts のプラグインからも読まれる。
// ~/config/langs と同じ理由で `~/` エイリアスは使わず相対パスでインポートする。
import { getLangRoute } from '../utils/lang'
import { LANGS } from './langs'

// 言語プレフィックスを除いたパス。全言語ぶんのURLはここから組み立てる。
export const PAGES = {
  TOAHU2026_10_100: {
    id: 'TOAHU2026_10_100',
    path: '/',
  },
  TOAHU2026_10_110: {
    id: 'TOAHU2026_10_110',
    path: '/day1/',
  },
  TOAHU2026_10_120: {
    id: 'TOAHU2026_10_120',
    path: '/day2/',
  },
  TOAHU2026_10_130: {
    id: 'TOAHU2026_10_130',
    path: '/day3/',
  },
  TOAHU2026_10_140: {
    id: 'TOAHU2026_10_140',
    path: '/day4/',
  },
  TOAHU2026_10_150: {
    id: 'TOAHU2026_10_150',
    path: '/day5/',
  },
  TOAHU2026_10_160: {
    id: 'TOAHU2026_10_160',
    path: '/day6/',
  },
  TOAHU2026_20_100: {
    id: 'TOAHU2026_20_100',
    path: '/map/',
  },
} as const

export type PageId = keyof typeof PAGES

// サイトマップに載せるページ（404は除外する）
export const SITEMAP_PAGE_PATHS: string[] = Object.values(PAGES).map(
  (page) => page.path,
)

// 全言語 × 全ページの組み合わせ。sitemap.xml の生成と、devサーバーの
// 末尾スラッシュ補完の両方がこれを参照する。
export const getPageEntries = () => {
  return LANGS.flatMap((lang) =>
    SITEMAP_PAGE_PATHS.map((pagePath) => ({
      lang,
      pagePath,
      url: `${getLangRoute(lang)}${pagePath}`,
    })),
  )
}
