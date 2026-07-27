import { type ReactNode } from 'react'

import { Footer } from '~/components/common/Footer'
import { Header } from '~/components/common/Header'
import { type PageId } from '~/config/pages'
import { type Lang } from '~/types/lang'

type LayoutDefaultProps = {
  lang: Lang
  pageId?: PageId
  children?: ReactNode
}

export const LayoutDefault = ({
  lang,
  pageId,
  children,
}: LayoutDefaultProps) => {
  return (
    <>
      <Header lang={lang} pageId={pageId} />
      <main className='LayoutMain'>{children}</main>
      <Footer lang={lang} />
    </>
  )
}
