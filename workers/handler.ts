import { createWorkerFetch } from '@inumberx/cloudflare-workers-basic-auth'

// Mirror of bindings declared in `wrangler.jsonc` plus Workers secrets set via
// `wrangler secret put`. Keep in sync manually whenever `wrangler.jsonc`
// changes; `npm run build` does not regenerate this type.
//
// ASSETS is typed structurally instead of via `@cloudflare/workers-types` so
// the Workers globals cannot clash with the DOM lib the site's own code uses.
export type WorkerEnv = {
  BASIC_AUTH_USER?: string
  BASIC_AUTH_PASS?: string
  ASSETS: { fetch: (request: Request) => Response | Promise<Response> }
}

// Cloudflare の ASSETS バインディングは `not_found_handling` を1つしか持てないため、
// 言語ごとの404ページの振り分けはここで行う。ja はプレフィックス無しで公開している
// ので、/en 配下だけを英語の404に向ければよい。
function getNotFoundPath(pathname: string) {
  return pathname === '/en' || pathname.startsWith('/en/')
    ? '/en/404.html'
    : '/404.html'
}

export function handleWorkerRequest(
  request: Request,
  env: WorkerEnv,
): Promise<Response> {
  return createWorkerFetch<WorkerEnv>({
    // `createWorkerFetch` serves GET/HEAD from ASSETS first and only falls
    // through to `handler` when the binding answers 404, so this is where a
    // miss turns into the 404 page minista built. It needs `env`, hence
    // building the wrapper per request — a closure allocation with no I/O,
    // unlike the SSR handlers the other sites hoist to module scope.
    handler: async () => {
      const requestUrl = new URL(request.url)
      const notFoundUrl = new URL(
        getNotFoundPath(requestUrl.pathname),
        requestUrl,
      ).href
      const response = await env.ASSETS.fetch(new Request(notFoundUrl))

      return new Response(response.body, {
        status: 404,
        headers: response.headers,
      })
    },
    realm: 'trip-oahu-2026',
    basicAuth: (workerEnv) => ({
      user: workerEnv.BASIC_AUTH_USER,
      pass: workerEnv.BASIC_AUTH_PASS,
    }),
    assets: (workerEnv) => workerEnv.ASSETS,
  })(request, env)
}
