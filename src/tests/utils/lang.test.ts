import { describe, expect, test } from 'vitest'

import { LANG } from '~/config/langs'
import {
  getLangFromUrl,
  getLangRoute,
  isLang,
  stripLangFromUrl,
} from '~/utils/lang'

describe('getLangRoute', () => {
  test('ja はプレフィックス無し', () => {
    expect(getLangRoute(LANG.JA)).toBe('')
  })

  test('en は /en', () => {
    expect(getLangRoute(LANG.EN)).toBe('/en')
  })

  test('未指定はデフォルト言語（ja）扱い', () => {
    expect(getLangRoute()).toBe('')
  })
})

describe('getLangFromUrl', () => {
  test.each([
    ['/', LANG.JA],
    ['/itinerary/', LANG.JA],
    ['/en/', LANG.EN],
    ['/en/itinerary/', LANG.EN],
    ['/en/404', LANG.EN],
  ])('%s -> %s', (url, expected) => {
    expect(getLangFromUrl(url)).toBe(expected)
  })

  test('言語として解釈できない先頭セグメントはデフォルト言語になる', () => {
    expect(getLangFromUrl('/itinerary/en/')).toBe(LANG.JA)
    expect(getLangFromUrl('/fr/')).toBe(LANG.JA)
  })

  test('/ja/ は言語プレフィックスとして扱わない（jaは常にルート）', () => {
    expect(getLangFromUrl('/ja/')).toBe(LANG.JA)
    expect(stripLangFromUrl('/ja/')).toBe('/ja/')
  })
})

describe('stripLangFromUrl', () => {
  test.each([
    ['/', '/'],
    ['/itinerary/', '/itinerary/'],
    ['/en/', '/'],
    ['/en/itinerary/', '/itinerary/'],
  ])('%s -> %s', (url, expected) => {
    expect(stripLangFromUrl(url)).toBe(expected)
  })
})

describe('isLang', () => {
  test('対応言語のみ true', () => {
    expect(isLang('ja')).toBe(true)
    expect(isLang('en')).toBe(true)
    expect(isLang('zh')).toBe(false)
  })
})
