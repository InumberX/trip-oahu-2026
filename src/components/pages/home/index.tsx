import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { LayoutInner } from '~/components/ui/layouts/Inner'
import { LayoutPageWrapper } from '~/components/ui/layouts/PageWrapper'
import { LayoutSection } from '~/components/ui/layouts/Section'
import { getSiteInfo } from '~/config/consts'
import { PAGES } from '~/config/pages'
import { routes } from '~/config/routes'
import { LayoutDefault } from '~/layouts/Base'
import { type Lang } from '~/types/lang'
import { getDictionary } from '~/utils/locale'

type PageTOAHU2026_10_100Props = {
  lang: Lang
}

export const PageTOAHU2026_10_100 = ({ lang }: PageTOAHU2026_10_100Props) => {
  const page = PAGES.TOAHU2026_10_100
  const dict = getDictionary(lang, 'pages/TOAHU2026_10_100')
  const siteInfo = getSiteInfo(lang)

  return (
    <LayoutDefault lang={lang} pageId={page.id}>
      <LayoutPageWrapper>
        <LayoutSection isNotSection>
          <LayoutInner>
            <h1>{siteInfo.siteTitle}</h1>
            <p>{dict.lead}</p>
            <PrimitiveButton url={routes.TOAHU2026_20_100.getUrl(lang)}>
              {dict.viewMap}
            </PrimitiveButton>
          </LayoutInner>
        </LayoutSection>
      </LayoutPageWrapper>
    </LayoutDefault>
  )
}
