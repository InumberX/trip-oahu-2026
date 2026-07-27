import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { LanguageSwitch } from '~/components/common/LanguageSwitch'
import { LANG } from '~/config/langs'

describe('LanguageSwitch', () => {
  test('ja 表示時は en へのリンクを同じページで出す', () => {
    render(<LanguageSwitch lang={LANG.JA} pageId='TOAHU2026_20_100' />)

    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute(
      'href',
      '/en/itinerary/',
    )
  })

  test('en 表示時は ja へのリンクを同じページで出す', () => {
    render(<LanguageSwitch lang={LANG.EN} pageId='TOAHU2026_20_100' />)

    expect(screen.getByRole('link', { name: '日本語' })).toHaveAttribute(
      'href',
      '/itinerary/',
    )
  })

  test('現在の言語はリンクにせず aria-current を付ける', () => {
    render(<LanguageSwitch lang={LANG.JA} pageId='TOAHU2026_20_100' />)

    expect(screen.queryByRole('link', { name: '日本語' })).toBeNull()
    expect(screen.getByText('日本語')).toHaveAttribute('aria-current', 'true')
  })

  test('pageId 未指定ならその言語のトップへ誘導する', () => {
    render(<LanguageSwitch lang={LANG.JA} />)

    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute(
      'href',
      '/en/',
    )
  })
})
