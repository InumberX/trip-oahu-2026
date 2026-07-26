import { describe, expect, test } from 'vitest'

import { getPageEntries } from '~/config/pages'

describe('getPageEntries', () => {
  test('全言語 × 全ページのURLを返す', () => {
    expect(getPageEntries().map((entry) => entry.url)).toEqual([
      '/',
      '/itinerary/',
      '/en/',
      '/en/itinerary/',
    ])
  })

  test('URLは必ず末尾スラッシュで終わる（devの末尾スラッシュ補完が前提にしている）', () => {
    for (const entry of getPageEntries()) {
      expect(entry.url.endsWith('/')).toBe(true)
    }
  })
})
