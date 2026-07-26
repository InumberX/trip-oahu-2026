import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'

describe('PrimitiveButton', () => {
  test('url が無ければ button として描画される', () => {
    render(<PrimitiveButton>旅程を見る</PrimitiveButton>)

    const button = screen.getByRole('button', { name: '旅程を見る' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
  })

  test('url があれば anchor として描画される', () => {
    render(<PrimitiveButton url='/itinerary/'>旅程を見る</PrimitiveButton>)

    expect(screen.getByRole('link', { name: '旅程を見る' })).toHaveAttribute(
      'href',
      '/itinerary/',
    )
  })

  test('isDisabled で disabled 属性と修飾クラスが付く', () => {
    render(<PrimitiveButton isDisabled>旅程を見る</PrimitiveButton>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('PrimitiveButton--disabled')
  })
})
