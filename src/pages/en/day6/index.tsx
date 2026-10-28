import { PageTOAHU2026_10_160 } from '~/components/pages/day6'
import { LANG } from '~/config/langs'
import { type Metadata } from '~/types/metadata'
import { getDictionary } from '~/utils/locale'

const dict = getDictionary(LANG.EN, 'pages/TOAHU2026_10_160')

export const metadata: Metadata = {
  title: dict.name,
  description: dict.description,
}

const Page = () => <PageTOAHU2026_10_160 lang={LANG.EN} />

export default Page
