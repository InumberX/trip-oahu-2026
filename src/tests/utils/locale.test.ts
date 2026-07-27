import { describe, expect, test } from 'vitest'

import { LANG } from '~/config/langs'
import { getDictionary } from '~/utils/locale'

describe('getDictionary', () => {
  test('言語ごとに別の値を返す', () => {
    expect(getDictionary(LANG.JA, 'pages/TOAHU2026_20_100').name).toBe('旅程')
    expect(getDictionary(LANG.EN, 'pages/TOAHU2026_20_100').name).toBe(
      'Itinerary',
    )
  })

  test('ja と en で同じキー集合を持つ', () => {
    const namespaces = [
      'common',
      'pages/TOAHU2026_10_100',
      'pages/TOAHU2026_20_100',
      'pages/TOAHU2026_E_404',
      'components/common/header',
    ] as const

    for (const ns of namespaces) {
      expect(Object.keys(getDictionary(LANG.EN, ns)).sort()).toEqual(
        Object.keys(getDictionary(LANG.JA, ns)).sort(),
      )
    }
  })
})
