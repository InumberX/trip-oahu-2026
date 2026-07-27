import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { LayoutInner } from '~/components/ui/layouts/Inner'
import { LayoutPageWrapper } from '~/components/ui/layouts/PageWrapper'
import { LayoutSection } from '~/components/ui/layouts/Section'
import { routes } from '~/config/routes'
import { LayoutDefault } from '~/layouts/Base'
import { type Lang } from '~/types/lang'
import { getDictionary } from '~/utils/locale'

type NotFoundPageProps = {
  lang: Lang
}

export const NotFoundPage = ({ lang }: NotFoundPageProps) => {
  const dict = getDictionary(lang, 'pages/TOAHU2026_E_404')
  const common = getDictionary(lang, 'common')

  return (
    // 404は対応する別言語ページを持たないため pageId を渡さない
    // （言語切替はその言語のトップへ誘導する）
    <LayoutDefault lang={lang}>
      <LayoutPageWrapper>
        <LayoutSection isNotSection>
          <LayoutInner>
            <h1>404</h1>
            <p>{dict.lead}</p>
            <PrimitiveButton url={routes.TOAHU2026_10_100.getUrl(lang)}>
              {common.backToHome}
            </PrimitiveButton>
          </LayoutInner>
        </LayoutSection>
      </LayoutPageWrapper>
    </LayoutDefault>
  )
}
