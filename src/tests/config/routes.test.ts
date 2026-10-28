import { describe, expect, test } from 'vitest'

import { LANG } from '~/config/langs'
import { routes } from '~/config/routes'

describe('routes', () => {
  test('ja はプレフィックス無しのURLを返す', () => {
    expect(routes.TOAHU2026_10_100.getUrl(LANG.JA)).toBe('/')
    expect(routes.TOAHU2026_10_110.getUrl(LANG.JA)).toBe('/day1/')
    expect(routes.TOAHU2026_20_100.getUrl(LANG.JA)).toBe('/map/')
  })

  test('en は /en 配下のURLを返す', () => {
    expect(routes.TOAHU2026_10_100.getUrl(LANG.EN)).toBe('/en/')
    expect(routes.TOAHU2026_10_110.getUrl(LANG.EN)).toBe('/en/day1/')
    expect(routes.TOAHU2026_20_100.getUrl(LANG.EN)).toBe('/en/map/')
  })

  test('ページ名は言語ごとに切り替わる', () => {
    expect(routes.TOAHU2026_20_100.getName(LANG.JA)).toBe('マップ')
    expect(routes.TOAHU2026_20_100.getName(LANG.EN)).toBe('Map')
  })
})
