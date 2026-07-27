// このモジュールは minista.config.ts（サイトマップ生成プラグイン）からも読まれる。
// Vite の設定ローダーは `~/...` をベア指定子と見て外部化してしまい解決に失敗するため、
// ここでは相対パスでインポートする。環境変数にも依存させない。
import { type Lang } from '../types/lang'

export const LANG = {
  JA: 'ja',
  EN: 'en',
} as const

export const LANGS: Lang[] = [LANG.JA, LANG.EN]

// ja はプレフィックス無し（/）、en は /en 配下で公開する
export const DEFAULT_LANG: Lang = LANG.JA

// OGP の og:locale は language_TERRITORY 形式が推奨。言語コード単体（ja / en）は
// 一部クローラに無視されるため、地域付きの正規な値を持たせる。
export const OG_LOCALE: { [K in Lang]: string } = {
  [LANG.JA]: 'ja_JP',
  [LANG.EN]: 'en_US',
}
