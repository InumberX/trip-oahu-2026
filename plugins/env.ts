// 真偽値として扱う環境変数のパーサ。
//
// 環境変数は必ず文字列で渡るため `Boolean(value)` では判定できない
// （`Boolean('false') === true`）。GitHub Environment の Variables に `false` と
// 入れた場合に本番が noindex になってしまうため、否定を意味する代表的な表記を
// 明示的に false として扱う。
const FALSY_VALUES = ['false', '0', 'no', 'off', 'null', 'undefined']

export const parseBooleanEnv = (value: string | undefined) => {
  if (!value) {
    return false
  }

  return !FALSY_VALUES.includes(value.trim().toLowerCase())
}
