import { type Meta, type StoryObj } from '@storybook/react-vite'

import { LanguageSwitch } from '~/components/common/LanguageSwitch'
import { LANG } from '~/config/langs'

const meta = {
  title: 'components/common/LanguageSwitch',
  component: LanguageSwitch,
  args: {
    lang: LANG.JA,
    pageId: 'TOAHU2026_20_100',
  },
} satisfies Meta<typeof LanguageSwitch>

export default meta

type Story = StoryObj<typeof meta>

export const Ja: Story = {}

export const En: Story = {
  args: {
    lang: LANG.EN,
  },
}

// 404など対応する別言語ページが無い場合はトップへ誘導する
export const WithoutPageId: Story = {
  args: {
    pageId: undefined,
  },
}
