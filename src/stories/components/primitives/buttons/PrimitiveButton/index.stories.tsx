import { type Meta, type StoryObj } from '@storybook/react-vite'

import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'

const meta = {
  title: 'components/primitives/buttons/PrimitiveButton',
  component: PrimitiveButton,
  args: {
    children: '旅程を見る',
  },
} satisfies Meta<typeof PrimitiveButton>

export default meta

type Story = StoryObj<typeof meta>

export const Button: Story = {}

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
}

export const Anchor: Story = {
  args: {
    url: '/itinerary/',
  },
}
