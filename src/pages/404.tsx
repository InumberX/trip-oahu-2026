import { NotFoundPage } from '~/components/pages/not-found'
import { LANG } from '~/config/langs'
import { type Metadata } from '~/types/metadata'
import { getDictionary } from '~/utils/locale'

export const metadata: Metadata = {
  title: getDictionary(LANG.JA, 'pages/TOAHU2026_E_404').name,
  noindex: true,
}

const Page = () => <NotFoundPage lang={LANG.JA} />

export default Page
