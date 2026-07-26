import { describe, expect, test } from 'vitest'

import { formatHst, formatJst } from '~/utils/date'

// 日本(UTC+9)とハワイ(UTC-10)は19時間差。同じ瞬間が別の日付・時刻になることを確認する。
describe('date', () => {
  test('formatJst は日本時間で整形する', () => {
    expect(formatJst('2026-09-19T21:00:00+09:00')).toBe('2026/09/19 21:00')
  })

  test('formatHst は同じ瞬間をハワイ時間で整形する', () => {
    expect(formatHst('2026-09-19T21:00:00+09:00')).toBe('2026/09/19 02:00')
  })

  test('日付をまたぐ場合も正しく変換する', () => {
    // 日本時間の 09:00 は前日のハワイ時間 14:00
    expect(formatHst('2026-09-20T09:00:00+09:00')).toBe('2026/09/19 14:00')
  })

  test('書式を指定できる', () => {
    expect(formatJst('2026-09-19T21:00:00+09:00', 'M月d日 HH:mm')).toBe(
      '9月19日 21:00',
    )
  })
})
