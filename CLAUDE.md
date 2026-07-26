# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static site built with React 19, TypeScript, and [Minista v4](https://minista.qranoko.jp/),
deployed to **Cloudflare Workers**. Minista v4 runs as a wrapper around Vite — the config is a
standard Vite config and SSG/asset features are provided as Vite plugins. It generates static
HTML from React components — this is **not** a SPA, and the output currently ships **zero JS**
apart from Google Analytics.

The site is bilingual (ja / en) and gated behind optional Basic auth at the Worker layer.

| Environment | URL | Worker name | Branch |
| --- | --- | --- | --- |
| development | https://dev-trip-oahu-2026.afterworks.jp | `dev-trip-oahu-2026` | `develop` |
| production | https://trip-oahu-2026.afterworks.jp | `trip-oahu-2026` | `main` |

## Commands

```bash
# Development
npm run dev              # Dev server at http://localhost:5173
npm start                # Serve built dist/ through the Worker (Basic auth check)
npm run storybook        # Storybook at http://localhost:6006

# Test
npm run test             # Vitest in watch mode
npm run test-run         # Vitest single run (used in CI)

# Build
npm run build            # Generate static site to dist/
npm run preview          # Preview production build

# Quality (run all at once with: npm run pre-commit)
npm run typecheck        # tsc -b
npm run lint-fix         # oxlint with auto-fix (whole repo)
npm run stylelint-fix    # StyleLint with auto-fix
npm run format-fix       # oxfmt with auto-fix (whole repo)

# Deploy
npm run deploy-development
npm run deploy-production
```

`lint` and `format` target the **whole repository** (`oxlint .` / `oxfmt .`), not a glob, so
root config files (`minista.config.ts`, `plugins/*.ts`, …) are checked too.

## Architecture

### Page Rendering Pipeline

```
src/layouts/index.tsx (global layout: SEO <Head>, hreflang, CSS entry, GA)
  └── LayoutWrapper (components/ui/layouts/Wrapper)
      └── Page component (src/pages/**)          ← thin per-language wrapper
          └── Page body (src/components/pages/**) ← shared, takes `lang` prop
              └── LayoutDefault (layouts/Base: Header + Main + Footer)
```

Pages use file-based routing in `src/pages/` and export a `metadata` object (the v4 name minista
reads). Minista spreads each page's `metadata` (plus `url`) into the props of both the global
layout and the page component:

```js
// minista/src/plugins/ssg/utils/html.js
const props = { title: '', draft: false, ...layout.metadata, ...page.metadata,
                ...layout.staticData.props, ...page.staticData.props, url: page.url }
```

`url` is the **resolved** URL, so the global layout derives the current language from it.

### Key Directories

- `src/pages/` — File-based routes. Thin wrappers only: export `metadata` + a default component
  that renders the shared page body with an explicit `lang`.
- `src/components/pages/` — Page bodies (one per page, shared by both languages)
- `src/layouts/index.tsx` — Global layout minista wraps every page in
- `src/layouts/Base/` — LayoutDefault (Header/Footer shell)
- `src/components/{common,ui,primitives}/` — Component layers
- `src/config/` — env, constants, langs, page definitions, routes
- `src/locales/{ja,en}/` — Translation resources
- `src/utils/` — Logic (`lang.ts`, `locale.ts`, `date.ts`)
- `src/types/` — Shared type definitions
- `src/assets/css/style.css` — Main CSS entry using CSS Layers
- `src/assets/post-css/global/` — Design tokens (color, font, layout, z-index, breakpoints)
- `src/stories/` — Storybook stories mirroring component structure
- `src/tests/` — Vitest tests mirroring component structure
- `plugins/` — Local Vite plugins (sitemap.xml, robots.txt, dev trailing-slash)
- `workers/` — Cloudflare Worker entrypoint (Basic auth + per-language 404)

## Internationalization (ja / en)

`ja` is the default and served without a prefix; `en` lives under `/en`. Same URL scheme as
after_works-v006 and sugidama, but **no i18next runtime** — everything is resolved at build
time via `getDictionary(lang, ns)` in `~/utils/locale`, so the bundle stays JS-free and
Storybook needs no provider.

| | ja | en |
| --- | --- | --- |
| Top | `/` | `/en/` |
| Itinerary | `/itinerary/` | `/en/itinerary/` |
| 404 | `/404.html` | `/en/404.html` |

**Adding a page:**

1. Add the path to `src/config/pages.ts` (sitemap and hreflang follow automatically)
2. Create the body in `src/components/pages/<name>/index.tsx`, taking a `lang` prop
3. Add thin wrappers in both `src/pages/` and `src/pages/en/`
4. Add translations to `src/locales/{ja,en}/pages/<pageId>.json`

`src/tests/utils/locale.test.ts` asserts ja and en have identical key sets, so a missing
translation fails the test suite.

### Page ID naming

Site prefix is `TOAHU2026`. Translation filename (`src/locales/*/pages/<pageId>.json`) and
namespace (`pages/<pageId>`) always match.

| Kind | Format | Example |
| --- | --- | --- |
| Normal page | `TOAHU2026_<group>_<seq>` | `TOAHU2026_10_100`, `TOAHU2026_20_100` |
| Error page | `TOAHU2026_E_<HTTP status>` | `TOAHU2026_E_404` |

Error pages use the HTTP status instead of a sequence number because 404 is **not** a routable
page: it is absent from `PAGES` (no `path`, excluded from the sitemap, cannot be a `pageId`
prop) and exists only as a translation namespace.

## Minista Gotchas

These are the non-obvious behaviours this repo has already been bitten by. Read before touching
the layout or adding a build plugin.

### Head tags must be a flat array

`HeadProvider` flattens tags with `[value].flat()` — **one level only**. Passing a nested array
(e.g. `{LANGS.map(...)}`) as `<Head>` children leaves the inner array as a single "tag", and
`headTagToStr` returns an empty string for it. **Tags vanish with no error or warning.**

Build the head tag list as a flat `ReactElement[]` and pass it via the `tags` prop.
`src/tests/layouts/index.test.tsx` reproduces minista's exact collection logic to catch this.

### Attribute names are not converted

Minista serializes head tags itself (not through React), and `attrNameMap` only maps `charSet`.
So React-style `hrefLang` is emitted verbatim as `hrefLang="ja"`. HTML attribute names are
case-insensitive so it works, but use lowercase `hreflang` via `createElement` for the canonical
form. Booleans become `async="true"`, which is valid for HTML boolean attributes.

`dangerouslySetInnerHTML` **is** supported for non-void tags (used for the GA init script).

### Head tags are deduplicated by `key`

`filterHeadTags` keys a `Map` by React `key`, so two tags sharing a key collapse to the last one.
Give head tags explicit, stable keys.

### `~/` aliases are unavailable in config-loaded modules

Vite's config loader treats `~/...` as a bare specifier and externalizes it, failing with
`Cannot find package '~'`. `src/config/langs.ts`, `src/config/pages.ts` and `src/utils/lang.ts`
are imported by `minista.config.ts` plugins, so **those three use relative imports** and must
not depend on `~/config/env` or the locale JSON.

### Pages are always written as `.html`

`getHtmlFileName` appends `.html`/`index.html` and `transformHtml` wraps output in
`<!doctype html>`. Non-HTML artifacts (sitemap.xml, robots.txt) therefore cannot be pages —
they are emitted by local Vite plugins in `plugins/` on `writeBundle`.

### Dev server resolves page URLs by exact match

`page.url === url`, so `/en` (no trailing slash) 404s in dev while Cloudflare's ASSETS
`html_handling` 307-redirects it. `plugins/trailing-slash.ts` (dev only) mirrors the redirect.
All internal links produced by `~/config/routes` already carry trailing slashes.

## Cloudflare / Worker

`workers/handler.ts` gates every request behind Basic auth before handing off to the ASSETS
binding (`run_worker_first: true` in `wrangler.jsonc`, so static files are covered too).

- Basic auth is opt-in: set **both** `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` to enable, leave
  both unset to disable. Setting only one returns 503 for every request (fail closed).
- `createWorkerFetch` falls through to `handler` only when ASSETS answers 404, which is where
  the built 404 page is served. `not_found_handling` is kept at `"none"` so the Worker sees the
  bare 404 and can pick the language: `/en` prefix → `/en/404.html`, otherwise `/404.html`.
- `ASSETS` is typed structurally rather than via `@cloudflare/workers-types` so Workers globals
  cannot clash with the DOM lib the site's own code uses.

## Environment Variables

Injected at build time via `define` in `minista.config.ts`; **never read at runtime**. Vite only
auto-exposes `VITE_`-prefixed values from `.env` files and never `process.env`, so CI-injected
variables must be listed explicitly.

| Variable | Purpose |
| --- | --- |
| `NO_INDEX` | Non-empty → `noindex, nofollow` + `Disallow: /` in robots.txt |
| `SITE_URL` | canonical / OG URL / sitemap `loc` |
| `SITE_NAME` | Site name (used in `<title>`) |
| `GOOGLE_ANALYTICS_ID` | GA measurement ID (falls back to a hardcoded default) |

Read from code through `~/config/env`. `vitest.config.ts` and `vite-storybook.config.ts` carry
the **same `define` keys** because neither loads the minista config — add new variables in all
three places.

## CSS Architecture

PostCSS (not Sass) with CSS Layers for specificity control:

```
@layer reset → lib → base → component-primitives → component-ui-low →
       component-ui-middle → component-ui-high → component-common →
       component-page → util
```

Component styles live next to the component and are `@import`ed from
`src/assets/css/style.css`. Responsive mixins are defined in `postcss.config.mjs`
(`getMediaQuery*`, `getMediaQueryReverse*`, `getMediaQueryBetween*`, `getContainerQuery*`,
`getFontSize`, `getClampPx`, `getClampRem`, `getLineClamp`).

Use **logical properties** (`inline-size`, `margin-inline`, `padding-block`, …) rather than
physical ones. Design tokens are CSS custom properties in `assets/post-css/global/`.

Breakpoints: xs=360, sm=576, md=768, lg=992, xl=1200, xxl=1400

## Code Conventions

- **File names**: kebab-case, **except** component directories, which are PascalCase and match
  the component name (`components/common/LanguageSwitch/`). `src/stories/` and `src/tests/`
  mirror that structure. Page-body directories under `components/pages/` are lowercase
  (`top`, `itinerary`, `not-found`).
- **Components**: functional arrow functions; PascalCase CSS class names (enforced by StyleLint
  `^[A-Z]+([a-zA-Z0-9\-_]+)*$`), alphabetical property order
- **Formatting**: single quotes, no semicolons, 2-space indent, trailing commas, printWidth 80,
  JSX single quotes (oxfmt, `.oxfmtrc.json`)
- **Imports**: grouped with newlines between groups, sorted (oxfmt `sortImports`,
  `internalPrefix: ['~/']`)
- **Lint**: oxlint (`.oxlintrc.json`) with the `typescript` and `react` plugins
- **Tests**: import `describe`/`test`/`expect`/`vi` explicitly from `vitest`
- **Path alias**: `~/` → `src/` (tsconfig `paths`, applied via Vite `resolve.tsconfigPaths`)
- **Node**: >= 24.0.0 (Volta pins 24.16.0)

## CI

- `push.yml` — any branch: `lint` (format → stylelint → lint → typecheck), `test`, then `build`
- `deploy.yml` — `develop`/`main`: lint + test, then `wrangler deploy` to the matching
  environment. Build-time variables come from GitHub Environment **Variables**; credentials from
  Secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).
- `automation-*.yml` — release PR (`develop` → `main`), release tag/notes
  (`v{YYYY.MM.DD}-{count}`), PR auto-labeling

Workflows use `$GITHUB_OUTPUT`; do **not** reintroduce `::set-output`, which GitHub has removed.

## Git Workflow

- Branch prefixes: `feature/*`, `bugfix/*`, `hotfix/*`
- PRs from `feature/*` auto-labeled `enhancement`; `bugfix/*`/`hotfix/*` labeled `bug`
- Push to `develop` creates a release PR to `main` (labeled `release`)
- Push to `main` auto-generates a release tag and notes
