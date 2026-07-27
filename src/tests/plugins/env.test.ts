import { describe, expect, test } from 'vitest'

import { parseBooleanEnv } from '../../../plugins/env'

describe('parseBooleanEnv', () => {
  test.each(['1', 'true', 'TRUE', 'yes', 'on', 'noindex'])(
    '%s は true',
    (value) => {
      expect(parseBooleanEnv(value)).toBe(true)
    },
  )

  // 環境変数は文字列で渡るため Boolean('false') === true になってしまう。
  // GitHub Variables に false と入れて本番が noindex になる事故を防ぐ。
  test.each(['false', 'FALSE', 'False', '0', 'no', 'off', 'null', 'undefined'])(
    '%s は false',
    (value) => {
      expect(parseBooleanEnv(value)).toBe(false)
    },
  )

  test('未設定・空文字は false', () => {
    expect(parseBooleanEnv(undefined)).toBe(false)
    expect(parseBooleanEnv('')).toBe(false)
  })

  test('前後の空白を無視する', () => {
    expect(parseBooleanEnv('  false  ')).toBe(false)
    expect(parseBooleanEnv('  true  ')).toBe(true)
  })
})
