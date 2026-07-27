// このモジュールは minista.config.ts（サイトマップ生成プラグイン）からも読まれる。
// ~/config/langs と同じ理由で相対インポートを使い、辞書（~/locales/*.json）には
// 依存させない。辞書を扱うものは ~/utils/locale に置く。
import { DEFAULT_LANG, LANG } from '../config/langs'
import { type Lang } from '../types/lang'

export const isLang = (value: string): value is Lang => {
  return value === LANG.JA || value === LANG.EN
}

// ja はプレフィックス無し、en は /en。sugidama の getLangRoute と同じ規約。
export const getLangRoute = (lang: Lang = DEFAULT_LANG) => {
  return lang === DEFAULT_LANG ? '' : `/${lang}`
}

// minista がレイアウトとページに渡す解決済みURLから言語を判定する。
export const getLangFromUrl = (url: string): Lang => {
  const firstSegment = url.split('/').filter(Boolean)[0]

  if (firstSegment && isLang(firstSegment) && firstSegment !== DEFAULT_LANG) {
    return firstSegment
  }

  return DEFAULT_LANG
}

// 言語プレフィックスを外した共通パス（hreflang の alternate 生成に使う）
export const stripLangFromUrl = (url: string) => {
  const langRoute = getLangRoute(getLangFromUrl(url))

  if (!langRoute) {
    return url
  }

  const stripped = url.slice(langRoute.length)
  return stripped === '' ? '/' : stripped
}
