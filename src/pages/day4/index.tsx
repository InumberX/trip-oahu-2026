import { PageTOAHU2026_10_140 } from '~/components/pages/day4'
import { LANG } from '~/config/langs'
import { type Metadata } from '~/types/metadata'
import { getDictionary } from '~/utils/locale'

const dict = getDictionary(LANG.JA, 'pages/TOAHU2026_10_140')

export const metadata: Metadata = {
  title: dict.name,
  description: dict.description,
}

const Page = () => <PageTOAHU2026_10_140 lang={LANG.JA} />

export default Page
