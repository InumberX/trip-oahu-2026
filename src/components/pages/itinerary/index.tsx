import { LayoutInner } from '~/components/ui/layouts/Inner'
import { LayoutPageWrapper } from '~/components/ui/layouts/PageWrapper'
import { LayoutSection } from '~/components/ui/layouts/Section'
import { DATETIME_FORMAT, TRIP_END, TRIP_START } from '~/config/consts'
import { LayoutDefault } from '~/layouts/Base'
import { type Lang } from '~/types/lang'
import { formatHst, formatJst } from '~/utils/date'
import { getDictionary } from '~/utils/locale'

type ItineraryPageProps = {
  lang: Lang
}

export const ItineraryPage = ({ lang }: ItineraryPageProps) => {
  const dict = getDictionary(lang, 'pages/TOAHU2026_20_100')
  const datetimeFormat = DATETIME_FORMAT[lang]

  const flights = [
    { id: 'outbound', label: dict.outbound, datetime: TRIP_START },
    { id: 'inbound', label: dict.inbound, datetime: TRIP_END },
  ]

  return (
    <LayoutDefault lang={lang} pageId='TOAHU2026_20_100'>
      <LayoutPageWrapper>
        <LayoutSection isNotSection>
          <LayoutInner>
            <h1>{dict.name}</h1>
          </LayoutInner>
        </LayoutSection>

        <LayoutSection>
          <LayoutInner>
            <h2>{dict.flightsHeading}</h2>
            <dl>
              {flights.map((flight) => (
                <div key={flight.id}>
                  <dt>{flight.label}</dt>
                  <dd>
                    {dict.timeJst} {formatJst(flight.datetime, datetimeFormat)}
                    {' / '}
                    {dict.timeHst} {formatHst(flight.datetime, datetimeFormat)}
                  </dd>
                </div>
              ))}
            </dl>
          </LayoutInner>
        </LayoutSection>
      </LayoutPageWrapper>
    </LayoutDefault>
  )
}
