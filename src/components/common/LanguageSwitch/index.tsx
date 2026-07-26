import { PrimitiveButton } from '~/components/primitives/buttons/PrimitiveButton'
import { LANG, LANGS } from '~/config/langs'
import { PAGES, type PageId } from '~/config/pages'
import { type Lang } from '~/types/lang'
import { getLangRoute } from '~/utils/lang'
import { getDictionary } from '~/utils/locale'

type LanguageSwitchProps = {
  lang: Lang
  // 同じページの別言語版に飛ばすためのページID。404など対応するページが無い場合は
  // 未指定にして、その言語のトップへ誘導する。
  pageId?: PageId
}

export const LanguageSwitch = ({ lang, pageId }: LanguageSwitchProps) => {
  const dict = getDictionary(lang, 'components/common/header')
  const basePath = pageId ? PAGES[pageId].path : '/'
  const labels = {
    [LANG.JA]: dict.langJa,
    [LANG.EN]: dict.langEn,
  }

  return (
    <nav className='LanguageSwitch' aria-label={dict.switchLangLabel}>
      <ul className='LanguageSwitch__items'>
        {LANGS.map((targetLang) => (
          <li className='LanguageSwitch__item' key={targetLang}>
            {targetLang === lang ? (
              <span className='LanguageSwitch__current' aria-current='true'>
                {labels[targetLang]}
              </span>
            ) : (
              <PrimitiveButton
                url={`${getLangRoute(targetLang)}${basePath}`}
                className='LanguageSwitch__link'
              >
                {labels[targetLang]}
              </PrimitiveButton>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
