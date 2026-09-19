import { LayoutInner } from '~/components/ui/layouts/Inner'
import { LayoutPageWrapper } from '~/components/ui/layouts/PageWrapper'
import { LayoutSection } from '~/components/ui/layouts/Section'
import { PAGES } from '~/config/pages'
import { LayoutDefault } from '~/layouts/Base'
import { type Lang } from '~/types/lang'
import { getDictionary } from '~/utils/locale'

type PageTOAHU2026_10_120Props = {
  lang: Lang
}

export const PageTOAHU2026_10_120 = ({ lang }: PageTOAHU2026_10_120Props) => {
  const page = PAGES.TOAHU2026_10_120
  const dict = getDictionary(lang, 'pages/TOAHU2026_10_120')

  return (
    <LayoutDefault lang={lang} pageId={page.id}>
      <LayoutPageWrapper>
        <LayoutSection isNotSection>
          <LayoutInner>
            <h1>{dict.name}</h1>
            <p>{dict.lead}</p>
          </LayoutInner>
        </LayoutSection>
      </LayoutPageWrapper>
    </LayoutDefault>
  )
}
