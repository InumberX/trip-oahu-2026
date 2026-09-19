import { describe, expect, test } from 'vitest'

import { getPageEntries } from '~/config/pages'

describe('getPageEntries', () => {
  test('全言語 × 全ページのURLを返す', () => {
    expect(getPageEntries().map((entry) => entry.url)).toEqual([
      '/',
      '/day1/',
      '/day2/',
      '/day3/',
      '/day4/',
      '/day5/',
      '/day6/',
      '/map/',
      '/en/',
      '/en/day1/',
      '/en/day2/',
      '/en/day3/',
      '/en/day4/',
      '/en/day5/',
      '/en/day6/',
      '/en/map/',
    ])
  })

  test('URLは必ず末尾スラッシュで終わる（devの末尾スラッシュ補完が前提にしている）', () => {
    for (const entry of getPageEntries()) {
      expect(entry.url.endsWith('/')).toBe(true)
    }
  })
})
