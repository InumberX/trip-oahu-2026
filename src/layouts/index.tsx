import { Head } from 'minista/head'
import { createElement, type ReactElement, type ReactNode } from 'react'

import { LayoutWrapper } from '~/components/ui/layouts/Wrapper'
import { getSiteInfo } from '~/config/consts'
import {
  CACHE_BUSTER,
  GOOGLE_ANALYTICS_ID,
  NO_INDEX,
  SITE_URL,
} from '~/config/env'
import { DEFAULT_LANG, LANGS, OG_LOCALE } from '~/config/langs'
import { type Metadata } from '~/types/metadata'
import { getLangFromUrl, getLangRoute, stripLangFromUrl } from '~/utils/lang'

type LayoutProps = Metadata & {
  url?: string
  children?: ReactNode
}

// minista の HeadProvider は渡されたタグを `[value].flat()` で1段だけ平坦化する。
// 入れ子の配列を children に渡すと headTagToStr が要素として扱えず空文字になり、
// タグが黙って消える。そのため head のタグは常にフラットな配列で組み立てて
// `tags` に渡す。
//
// あわせて、minista は React ではなく独自にタグをシリアライズし、属性名は
// `charSet` 以外そのまま出力する。React流の `hrefLang` では `hrefLang="ja"` と
// 出てしまうため（HTMLの属性名は大文字小文字を区別しないので動作はするが）、
// 正規の小文字 `hreflang` を createElement で直接指定する。
const createAlternateLink = (hreflang: string, href: string): ReactElement => {
  return createElement('link', {
    key: `alternate-${hreflang}`,
    rel: 'alternate',
    hreflang,
    href,
  })
}

// 計測IDが未設定の環境（ローカル・dev）では一切出力しない。
// minista の headTagToStr は script のような非空要素タグで
// dangerouslySetInnerHTML を innerHTML として扱うので、gtag の初期化を埋め込める。
export const createGoogleAnalyticsTags = (
  measurementId: string,
): ReactElement[] => {
  if (!measurementId) {
    return []
  }

  return [
    <script
      key='gtag-src'
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
    />,
    <script
      key='gtag-init'
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `,
      }}
    />,
  ]
}

const Layout = ({
  url,
  title,
  description,
  noindex,
  lang,
  children,
}: LayoutProps) => {
  const currentUrl = url ?? '/'
  // 言語は解決済みURLから導く。metadata.lang は明示的に上書きしたい場合のみ使う。
  const currentLang = lang ?? getLangFromUrl(currentUrl)
  const siteInfo = getSiteInfo(currentLang)

  const pageTitle = title
    ? `${title} | ${siteInfo.siteTitle}`
    : `${siteInfo.siteTitle} - ${siteInfo.titleNote}`
  const pageDescription = description || siteInfo.description
  // SITE_URL は env で末尾スラッシュ付きに設定されることがある。currentUrl は先頭が
  // '/' なので、そのまま連結すると canonical/OG/hreflang が二重スラッシュ（//）になる。
  // sitemap プラグインと同じく末尾スラッシュを除いてから連結する。
  const siteUrl = SITE_URL.replace(/\/$/, '')
  const ogUrl = `${siteUrl}${currentUrl}`
  // 環境変数によるサイト全体のnoindexと、ページ単位の指定のどちらでも有効にする
  const isNoindex = Boolean(NO_INDEX) || noindex || false
  const basePath = stripLangFromUrl(currentUrl)
  // og:type はトップページのみ website。言語プレフィックスを外したパスで判定し、
  // ja(/) と en(/en/) のトップで og:type が食い違わないようにする。
  const ogType = basePath === '/' ? 'website' : 'article'

  // 404など noindex のページに alternate を張ると別言語版の存在を誤って主張するため出さない
  const alternateLinks = isNoindex
    ? []
    : [
        ...LANGS.map((alternateLang) =>
          createAlternateLink(
            alternateLang,
            `${siteUrl}${getLangRoute(alternateLang)}${basePath}`,
          ),
        ),
        createAlternateLink(
          'x-default',
          `${siteUrl}${getLangRoute(DEFAULT_LANG)}${basePath}`,
        ),
      ]

  const headTags: ReactElement[] = [
    <meta
      key='format-detection'
      name='format-detection'
      content='telephone=no'
    />,
    <meta
      key='viewport'
      name='viewport'
      content='width=device-width,initial-scale=1.0,viewport-fit=cover'
    />,
    <title key='title'>{pageTitle}</title>,
    <meta key='description' name='description' content={pageDescription} />,
    <meta key='og:title' property='og:title' content={pageTitle} />,
    <meta
      key='og:description'
      property='og:description'
      content={pageDescription}
    />,
    <meta key='og:url' property='og:url' content={ogUrl} />,
    <meta
      key='og:site_name'
      property='og:site_name'
      content={siteInfo.siteTitle}
    />,
    <meta key='og:type' property='og:type' content={ogType} />,
    <meta
      key='og:locale'
      property='og:locale'
      content={OG_LOCALE[currentLang]}
    />,
    <meta
      key='twitter:card'
      name='twitter:card'
      content='summary_large_image'
    />,
    ...(isNoindex
      ? [<meta key='robots' name='robots' content='noindex, nofollow' />]
      : []),
    <link key='icon' rel='icon' href={`/favicon.svg?${CACHE_BUSTER}`} />,
    <link key='canonical' rel='canonical' href={ogUrl} />,
    ...alternateLinks,
    // pluginEntry がこのソースパスを検出してビルド済みCSSに差し替える
    <link key='stylesheet' rel='stylesheet' href='/src/assets/css/style.css' />,
    ...createGoogleAnalyticsTags(GOOGLE_ANALYTICS_ID),
  ]

  return (
    <>
      <Head htmlAttributes={{ lang: currentLang }} tags={headTags} />
      <LayoutWrapper>{children}</LayoutWrapper>
    </>
  )
}

export default Layout
