import { render } from '@testing-library/react'
import { HeadContext } from 'minista/context'
import { type ReactElement, isValidElement } from 'react'
import { describe, expect, test } from 'vitest'

import Layout from '~/layouts'

// vitest.config.ts の define と揃えた値
const SITE_URL = 'http://localhost:5173'

type CollectedTag = ReactElement<Record<string, unknown>>

// minista の HeadProvider と同じ収集処理（`[value].flat()` で1段だけ平坦化）を再現する。
// head のタグ配列が入れ子になると minista 側で黙って空文字になるため、この1段だけの
// flat をそのまま真似ることで退行を検出できる。
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

// isValidElement の型引数で props を絞り込む（既定では unknown になる）
const isElement = (tag: unknown): tag is CollectedTag => {
  return isValidElement<Record<string, unknown>>(tag)
}

const findLinks = (tags: unknown[], rel: string) => {
  return tags.filter((tag): tag is CollectedTag => {
    return isElement(tag) && tag.type === 'link' && tag.props.rel === rel
  })
}

const findByProp = (tags: unknown[], prop: string, value: string) => {
  return tags.filter((tag): tag is CollectedTag => {
    return isElement(tag) && tag.props[prop] === value
  })
}

describe('Layout head tags', () => {
  test('収集されたタグはすべて要素で、入れ子の配列を含まない', () => {
    const tags = collectHeadTags(<Layout url='/itinerary/' title='旅程' />)

    expect(tags.length).toBeGreaterThan(0)
    for (const tag of tags) {
      expect(Array.isArray(tag)).toBe(false)
      expect(isElement(tag)).toBe(true)
      // minista の headTagToStr は type が文字列でないタグを空文字にしてしまう
      expect(typeof (tag as CollectedTag).type).toBe('string')
    }
  })

  test('ja ページは全言語 + x-default の hreflang を出す', () => {
    const tags = collectHeadTags(<Layout url='/itinerary/' title='旅程' />)
    const alternates = findLinks(tags, 'alternate')

    expect(
      alternates.map((tag) => [tag.props.hreflang, tag.props.href]),
    ).toEqual([
      ['ja', `${SITE_URL}/itinerary/`],
      ['en', `${SITE_URL}/en/itinerary/`],
      ['x-default', `${SITE_URL}/itinerary/`],
    ])
  })

  test('en ページでも alternate の内容は同じ（自己参照を含む）', () => {
    const tags = collectHeadTags(
      <Layout url='/en/itinerary/' title='Itinerary' />,
    )
    const alternates = findLinks(tags, 'alternate')

    expect(
      alternates.map((tag) => [tag.props.hreflang, tag.props.href]),
    ).toEqual([
      ['ja', `${SITE_URL}/itinerary/`],
      ['en', `${SITE_URL}/en/itinerary/`],
      ['x-default', `${SITE_URL}/itinerary/`],
    ])
  })

  test('hreflang は小文字の属性名で渡す（minista は属性名を変換しない）', () => {
    const tags = collectHeadTags(<Layout url='/' />)
    const alternates = findLinks(tags, 'alternate')

    for (const tag of alternates) {
      expect(tag.props).toHaveProperty('hreflang')
      expect(tag.props).not.toHaveProperty('hrefLang')
    }
  })

  test('canonical は自ページのURLを指す', () => {
    const tags = collectHeadTags(<Layout url='/en/' />)

    expect(findLinks(tags, 'canonical')[0]?.props.href).toBe(`${SITE_URL}/en/`)
  })

  test('noindex のページは alternate を出さず robots を出す', () => {
    const tags = collectHeadTags(
      <Layout url='/en/404' title='Not found' noindex />,
    )

    expect(findLinks(tags, 'alternate')).toHaveLength(0)
    const robots = findByProp(tags, 'name', 'robots')
    expect(robots[0]?.props.content).toBe('noindex, nofollow')
  })

  test('言語はURLから判定して og:locale に反映される', () => {
    const tags = collectHeadTags(<Layout url='/en/' />)
    const ogLocale = findByProp(tags, 'property', 'og:locale')

    expect(ogLocale[0]?.props.content).toBe('en')
  })
})
