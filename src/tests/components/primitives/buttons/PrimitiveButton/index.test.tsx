import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'

describe('PrimitiveButton', () => {
  test('url が無ければ button として描画される', () => {
    render(<PrimitiveButton>マップを見る</PrimitiveButton>)

    const button = screen.getByRole('button', { name: 'マップを見る' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
  })

  test('url があれば anchor として描画される', () => {
    render(<PrimitiveButton url='/map/'>マップを見る</PrimitiveButton>)

    expect(screen.getByRole('link', { name: 'マップを見る' })).toHaveAttribute(
      'href',
      '/map/',
    )
  })

  test('isDisabled で disabled 属性と修飾クラスが付く', () => {
    render(<PrimitiveButton isDisabled>マップを見る</PrimitiveButton>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('PrimitiveButton--disabled')
  })
})
