import { describe, expect, test } from 'vitest'

import { createRobots } from '../../../plugins/robots'

const SITE_URL = 'https://trip-oahu-2026.afterworks.jp'

describe('createRobots', () => {
  test('本番（NO_INDEX 未設定）はクロールを許可し sitemap を示す', () => {
    const robots = createRobots({ siteUrl: SITE_URL, noIndex: false })

    expect(robots).toContain('User-agent: *')
    expect(robots).toContain('Allow: /')
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`)
    expect(robots).not.toContain('Disallow')
  })

  test('dev（NO_INDEX 設定）は全面的に拒否し sitemap を示さない', () => {
    const robots = createRobots({ siteUrl: SITE_URL, noIndex: true })

    expect(robots).toContain('Disallow: /')
    expect(robots).not.toContain('Allow: /')
    expect(robots).not.toContain('Sitemap:')
  })

  test('SITE_URL の末尾スラッシュが重複しない', () => {
    const robots = createRobots({ siteUrl: `${SITE_URL}/`, noIndex: false })

    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`)
    expect(robots).not.toContain('//sitemap.xml')
  })

  test('末尾は改行で終わる', () => {
    expect(createRobots({ siteUrl: SITE_URL, noIndex: false })).toMatch(/\n$/)
    expect(createRobots({ siteUrl: SITE_URL, noIndex: true })).toMatch(/\n$/)
  })
})
