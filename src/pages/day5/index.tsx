import { PageTOAHU2026_10_150 } from '~/components/pages/day5'
import { LANG } from '~/config/langs'
import { type Metadata } from '~/types/metadata'
import { getDictionary } from '~/utils/locale'

const dict = getDictionary(LANG.JA, 'pages/TOAHU2026_10_150')

export const metadata: Metadata = {
  title: dict.name,
  description: dict.description,
}

const Page = () => <PageTOAHU2026_10_150 lang={LANG.JA} />

export default Page
