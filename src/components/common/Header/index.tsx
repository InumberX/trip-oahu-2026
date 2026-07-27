import { LanguageSwitch } from '~/components/common/LanguageSwitch'
import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { LayoutInner } from '~/components/ui/layouts/Inner'
import { type PageId } from '~/config/pages'
import { globalNavRoutes } from '~/config/routes'
import { type Lang } from '~/types/lang'

type HeaderProps = {
  lang: Lang
  pageId?: PageId
}

export const Header = ({ lang, pageId }: HeaderProps) => {
  return (
    <header className='LayoutHeader'>
      <LayoutInner>
        <div className='LayoutHeader__container'>
          <ul className='LayoutHeader__items'>
            {globalNavRoutes.map((route) => (
              <li className='LayoutHeader__item' key={route.id}>
                <PrimitiveButton
                  url={route.getUrl(lang)}
                  className='LayoutHeader__link'
                >
                  {route.getName(lang)}
                </PrimitiveButton>
              </li>
            ))}
          </ul>
          <LanguageSwitch lang={lang} pageId={pageId} />
        </div>
      </LayoutInner>
    </header>
  )
}
