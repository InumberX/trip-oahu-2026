import { describe, expect, test } from 'vitest'

import { createSitemap } from '../../../plugins/sitemap'

const SITE_URL = 'https://trip-oahu-2026.afterworks.jp'
const LASTMOD = '2026-07-26T18:00:00+09:00'

describe('createSitemap', () => {
  const xml = createSitemap({ siteUrl: SITE_URL, lastmod: LASTMOD })

  test('全言語・全ページのURLを含む', () => {
    expect(xml).toContain(`<loc>${SITE_URL}/</loc>`)
    expect(xml).toContain(`<loc>${SITE_URL}/itinerary/</loc>`)
    expect(xml).toContain(`<loc>${SITE_URL}/en/</loc>`)
    expect(xml).toContain(`<loc>${SITE_URL}/en/itinerary/</loc>`)
  })

  test('<url> は言語数 × ページ数だけ出力される', () => {
    expect(xml.match(/<url>/g)).toHaveLength(4)
  })

  test('各URLに全言語の hreflang と x-default が付く', () => {
    expect(xml).toContain(
      `<xhtml:link rel="alternate" hreflang="ja" href="${SITE_URL}/itinerary/" />`,
    )
    expect(xml).toContain(
      `<xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en/itinerary/" />`,
    )
    expect(xml).toContain(
      `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/itinerary/" />`,
    )
  })

  test('404ページは含めない', () => {
    expect(xml).not.toContain('404')
  })

  test('lastmod を出力する', () => {
    expect(xml.match(/<lastmod>/g)).toHaveLength(4)
    expect(xml).toContain(`<lastmod>${LASTMOD}</lastmod>`)
  })

  test('XML宣言と名前空間を持つ', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
  })

  test('末尾のスラッシュが重複しない', () => {
    const withSlash = createSitemap({
      siteUrl: `${SITE_URL}/`,
      lastmod: LASTMOD,
    })
    expect(withSlash).toContain(`<loc>${SITE_URL}/</loc>`)
    expect(withSlash).not.toContain('//</loc>')
  })
})
