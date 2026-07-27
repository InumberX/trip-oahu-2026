import fs from 'node:fs'
import path from 'node:path'
import { type Plugin } from 'vite'

type RobotsOptions = {
  siteUrl: string
  // NO_INDEX が設定された環境（dev）はクロールを許可しない
  noIndex: boolean
  // 通常ビルドの出力先。minista は SSR ビルドも走らせるため、この dir のときだけ書き出す。
  outDir: string
}

export const createRobots = ({
  siteUrl,
  noIndex,
}: Omit<RobotsOptions, 'outDir'>) => {
  if (noIndex) {
    return ['User-agent: *', 'Disallow: /', ''].join('\n')
  }

  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
    '',
  ].join('\n')
}

// sitemap.xml と同じ理由（minista はページを必ず .html として書き出す）で、
// robots.txt もビルド後に直接書き出す。SITE_URL / NO_INDEX を参照するため
// public/ に静的ファイルとして置くことはできない。
export const pluginRobots = ({
  siteUrl,
  noIndex,
  outDir,
}: RobotsOptions): Plugin => {
  const resolvedOutDir = path.resolve(process.cwd(), outDir)

  return {
    name: 'trip-oahu-2026:robots',
    apply: 'build',
    writeBundle(options) {
      if (!options.dir || path.resolve(options.dir) !== resolvedOutDir) {
        return
      }

      fs.writeFileSync(
        path.join(options.dir, 'robots.txt'),
        createRobots({ siteUrl, noIndex }),
        'utf8',
      )
    },
  }
}
