import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { LayoutInner } from '~/components/ui/layouts/Inner'
import { LayoutPageWrapper } from '~/components/ui/layouts/PageWrapper'
import { LayoutSection } from '~/components/ui/layouts/Section'
import { getSiteInfo } from '~/config/consts'
import { routes } from '~/config/routes'
import { LayoutDefault } from '~/layouts/Base'
import { type Lang } from '~/types/lang'
import { getDictionary } from '~/utils/locale'

type TopPageProps = {
  lang: Lang
}

export const TopPage = ({ lang }: TopPageProps) => {
  const dict = getDictionary(lang, 'pages/TOAHU2026_10_100')
  const siteInfo = getSiteInfo(lang)

  return (
    <LayoutDefault lang={lang} pageId='TOAHU2026_10_100'>
      <LayoutPageWrapper>
        <LayoutSection isNotSection>
          <LayoutInner>
            <h1>{siteInfo.siteTitle}</h1>
            <p>{dict.lead}</p>
            <PrimitiveButton url={routes.TOAHU2026_20_100.getUrl(lang)}>
              {dict.viewItinerary}
            </PrimitiveButton>
          </LayoutInner>
        </LayoutSection>
      </LayoutPageWrapper>
    </LayoutDefault>
  )
}
