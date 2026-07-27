import fs from 'node:fs'
import path from 'node:path'
import { type Plugin } from 'vite'

import { DEFAULT_LANG, LANGS } from '../src/config/langs'
import { getPageEntries } from '../src/config/pages'
import { getLangRoute } from '../src/utils/lang'

type SitemapOptions = {
  siteUrl: string
  lastmod: string
  // 通常ビルドの出力先。minista は SSR ビルドも走らせるため、この dir のときだけ書き出す。
  outDir: string
}

const escapeXml = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const buildUrl = (siteUrl: string, langRoute: string, pagePath: string) => {
  return escapeXml(`${siteUrl.replace(/\/$/, '')}${langRoute}${pagePath}`)
}

export const createSitemap = ({
  siteUrl,
  lastmod,
}: Omit<SitemapOptions, 'outDir'>) => {
  const urls = getPageEntries()
    .map(({ lang, pagePath }) => {
      const loc = buildUrl(siteUrl, getLangRoute(lang), pagePath)
      // hreflang は自己参照も含めて全言語分を出し、x-default はデフォルト言語に向ける
      const alternates = LANGS.map(
        (lang) =>
          `    <xhtml:link rel="alternate" hreflang="${lang}" href="${buildUrl(siteUrl, getLangRoute(lang), pagePath)}" />`,
      )
      alternates.push(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${buildUrl(siteUrl, getLangRoute(DEFAULT_LANG), pagePath)}" />`,
      )

      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
        ...alternates,
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    '</urlset>',
    '',
  ].join('\n')
}

// minista はページを必ず .html として書き出し、HTMLを <!doctype html> で包むため、
// sitemap.xml をページとして生成できない。ビルド後に直接書き出す。
export const pluginSitemap = ({
  siteUrl,
  lastmod,
  outDir,
}: SitemapOptions): Plugin => {
  const resolvedOutDir = path.resolve(process.cwd(), outDir)

  return {
    name: 'trip-oahu-2026:sitemap',
    apply: 'build',
    writeBundle(options) {
      if (!options.dir || path.resolve(options.dir) !== resolvedOutDir) {
        return
      }

      fs.writeFileSync(
        path.join(options.dir, 'sitemap.xml'),
        createSitemap({ siteUrl, lastmod }),
        'utf8',
      )
    },
  }
}
