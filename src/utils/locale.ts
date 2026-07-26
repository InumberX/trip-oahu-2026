import { LANG } from '~/config/langs'
import enCommon from '~/locales/en/common.json'
import enComponentsCommonHeader from '~/locales/en/components/common/header.json'
import enPagesTOAHU2026_10_100 from '~/locales/en/pages/TOAHU2026_10_100.json'
import enPagesTOAHU2026_20_100 from '~/locales/en/pages/TOAHU2026_20_100.json'
import enPagesTOAHU2026_E_404 from '~/locales/en/pages/TOAHU2026_E_404.json'
import jaCommon from '~/locales/ja/common.json'
import jaComponentsCommonHeader from '~/locales/ja/components/common/header.json'
import jaPagesTOAHU2026_10_100 from '~/locales/ja/pages/TOAHU2026_10_100.json'
import jaPagesTOAHU2026_20_100 from '~/locales/ja/pages/TOAHU2026_20_100.json'
import jaPagesTOAHU2026_E_404 from '~/locales/ja/pages/TOAHU2026_E_404.json'
import { type Lang } from '~/types/lang'

// SSGなので i18next のようなランタイムは持たず、ビルド時に辞書を直接解決する。
// 名前空間の粒度は sugidama（common / pages/<ID> / components/...）に揃えている。
const resources = {
  [LANG.JA]: {
    common: jaCommon,
    'pages/TOAHU2026_10_100': jaPagesTOAHU2026_10_100,
    'pages/TOAHU2026_20_100': jaPagesTOAHU2026_20_100,
    'pages/TOAHU2026_E_404': jaPagesTOAHU2026_E_404,
    'components/common/header': jaComponentsCommonHeader,
  },
  [LANG.EN]: {
    common: enCommon,
    'pages/TOAHU2026_10_100': enPagesTOAHU2026_10_100,
    'pages/TOAHU2026_20_100': enPagesTOAHU2026_20_100,
    'pages/TOAHU2026_E_404': enPagesTOAHU2026_E_404,
    'components/common/header': enComponentsCommonHeader,
  },
} as const

export type Namespace = keyof (typeof resources)[typeof LANG.JA]

export const getDictionary = <NS extends Namespace>(lang: Lang, ns: NS) => {
  return resources[lang][ns]
}
