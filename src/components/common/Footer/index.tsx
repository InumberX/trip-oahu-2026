import { LayoutInner } from '~/components/ui/layouts/Inner'
import { getSiteInfo } from '~/config/consts'
import { type Lang } from '~/types/lang'

type FooterProps = {
  lang: Lang
}

export const Footer = ({ lang }: FooterProps) => {
  const siteInfo = getSiteInfo(lang)

  return (
    <footer className='LayoutFooter'>
      <LayoutInner>{siteInfo.siteTitle}</LayoutInner>
    </footer>
  )
}
