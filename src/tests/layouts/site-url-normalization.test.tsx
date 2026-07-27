import { render } from '@testing-library/react'
import { HeadContext } from 'minista/context'
import { type ReactElement, isValidElement } from 'react'
import { describe, expect, test, vi } from 'vitest'

// SITE_URL が末尾スラッシュ付きで設定された環境を再現する。
// （env の他の値は実際の define 値を維持する）
vi.mock('~/config/env', async (importOriginal) => {
  const actual = await importOriginal<typeof import('~/config/env')>()

  return { ...actual, SITE_URL: 'http://localhost:5173/' }
})

const { default: Layout } = await import('~/layouts')

type CollectedTag = ReactElement<Record<string, unknown>>

const isElement = (tag: unknown): tag is CollectedTag => {
  return isValidElement<Record<string, unknown>>(tag)
}

const collectHeadTags = (element: ReactElement) => {
  const tags: unknown[] = []
  const setHeadData = (key: string, value: unknown) => {
    if (key === 'tags') {
      tags.push(...[value].flat())
    }
  }

  render(
    <HeadContext.Provider value={{ setHeadData }}>
      {element}
    </HeadContext.Provider>,
  )

  return tags
}

const hrefs = (tags: unknown[]) => {
  return tags
    .filter(isElement)
    .map((tag) => tag.props.href ?? tag.props.content)
    .filter((value): value is string => typeof value === 'string')
    .filter((value) => value.startsWith('http'))
}

describe('SITE_URL の末尾スラッシュ正規化', () => {
  test('canonical / og:url / hreflang に二重スラッシュを出さない', () => {
    const tags = collectHeadTags(<Layout url='/en/' />)

    for (const href of hrefs(tags)) {
      // プロトコルの :// を除いた残りに // が現れないこと
      expect(href.replace('://', '')).not.toContain('//')
    }
  })

  test('canonical は正規化済みの URL を指す', () => {
    const tags = collectHeadTags(<Layout url='/en/' />)
    const canonical = tags
      .filter(isElement)
      .find((tag) => tag.type === 'link' && tag.props.rel === 'canonical')

    expect(canonical?.props.href).toBe('http://localhost:5173/en/')
  })
})
