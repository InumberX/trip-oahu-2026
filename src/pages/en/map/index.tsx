import { PageTOAHU2026_20_100 } from '~/components/pages/map'
import { LANG } from '~/config/langs'
import { type Metadata } from '~/types/metadata'
import { getDictionary } from '~/utils/locale'

const dict = getDictionary(LANG.EN, 'pages/TOAHU2026_20_100')

export const metadata: Metadata = {
  title: dict.name,
  description: dict.description,
}

const Page = () => <PageTOAHU2026_20_100 lang={LANG.EN} />

export default Page
