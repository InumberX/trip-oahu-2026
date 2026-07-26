import { TopPage } from '~/components/pages/top'
import { LANG } from '~/config/langs'
import { type Metadata } from '~/types/metadata'

export const metadata: Metadata = {}

const Page = () => <TopPage lang={LANG.EN} />

export default Page
