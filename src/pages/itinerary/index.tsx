import { ItineraryPage } from '~/components/pages/itinerary'
import { LANG } from '~/config/langs'
import { type Metadata } from '~/types/metadata'
import { getDictionary } from '~/utils/locale'

const dict = getDictionary(LANG.JA, 'pages/TOAHU2026_20_100')

export const metadata: Metadata = {
  title: dict.name,
  description: dict.description,
}

const Page = () => <ItineraryPage lang={LANG.JA} />

export default Page
