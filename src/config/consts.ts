import { SITE_NAME } from '~/config/env'
import { LANG } from '~/config/langs'
import { type Lang } from '~/types/lang'
import { getDictionary } from '~/utils/locale'

export const SITE_TITLE = SITE_NAME

export const getSiteInfo = (lang: Lang) => {
  const common = getDictionary(lang, 'common')

  return {
    siteTitle: SITE_TITLE,
    titleNote: common.siteTitleNote,
    description: common.siteDescription,
  }
}

// 旅程は日本とハワイをまたぐため、両方のタイムゾーンを持つ
export const JST_TIMEZONE = 'Asia/Tokyo'
export const HST_TIMEZONE = 'Pacific/Honolulu'

// 出発・帰着（日本時間）
export const TRIP_START = '2026-09-19T21:00:00+09:00'
export const TRIP_END = '2026-09-25T17:30:00+09:00'

// date-fns の書式は言語で切り替える
export const DATETIME_FORMAT = {
  [LANG.JA]: 'yyyy年M月d日 HH:mm',
  [LANG.EN]: 'MMM d, yyyy HH:mm',
} as const
