import { type Plugin } from 'vite'

import { getPageEntries } from '../src/config/pages'

// minista の devサーバーはページURLを完全一致（`page.url === url`）でしか解決しないため、
// 末尾スラッシュの無いURL（/en、/itinerary など）が 404 になる。
// 本番の Cloudflare では ASSETS の html_handling（既定は auto-trailing-slash）が
// 307 で末尾スラッシュ付きに飛ばすので、devでも同じ挙動になるよう補う。
//
// 判定は既知のページURLに限定する。Vite の内部リクエスト（/@vite/client など）や
// アセットには一切触らない。
export const pluginTrailingSlash = (): Plugin => {
  const pageUrls = new Set(getPageEntries().map((entry) => entry.url))

  return {
    name: 'trip-oahu-2026:trailing-slash',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [pathname, query] = (req.url ?? '').split('?')

        if (
          pathname &&
          !pathname.endsWith('/') &&
          pageUrls.has(`${pathname}/`)
        ) {
          res.statusCode = 307
          res.setHeader('Location', `${pathname}/${query ? `?${query}` : ''}`)
          res.end()
          return
        }

        next()
      })
    },
  }
}
