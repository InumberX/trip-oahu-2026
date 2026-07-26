# trip-oahu-2026

[minista v4](https://minista.qranoko.jp/)（React + Vite の静的サイトジェネレーター）で
生成した静的サイトを Cloudflare Workers 上で公開します。

| 環境        | URL                                      | Worker 名            | ブランチ  |
| ----------- | ---------------------------------------- | -------------------- | --------- |
| development | https://dev-trip-oahu-2026.afterworks.jp | `dev-trip-oahu-2026` | `develop` |
| production  | https://trip-oahu-2026.afterworks.jp     | `trip-oahu-2026`     | `main`    |

## 必要環境

- Node.js 24 系（`volta` / `engines` で 24.16.0 を指定）

## セットアップ

```sh
npm ci
cp .env.example .env.development.local   # ローカルでビルドする場合のみ
cp .dev.vars.example .dev.vars           # ローカルで Basic 認証を試す場合のみ
```

## 主なコマンド

| コマンド                            | 内容                                             |
| ----------------------------------- | ------------------------------------------------ |
| `npm run dev`                       | 開発サーバー（http://localhost:5173）            |
| `npm start`                         | ビルド済み `dist/` を Worker 経由で配信           |
| `npm run build`                     | 本番ビルド（`dist/` に出力）                     |
| `npm run typecheck`                 | `tsc -b`                                         |
| `npm run lint` / `lint-fix`         | oxlint（リポジトリ全体）                         |
| `npm run stylelint` / `-fix`        | StyleLint                                        |
| `npm run format` / `format-fix`     | oxfmt（リポジトリ全体）                          |
| `npm test` / `npm run test-run`     | Vitest（watch / 単発）                           |
| `npm run storybook`                 | Storybook（http://localhost:6006）               |
| `npm run pre-commit`                | typecheck → lint-fix → stylelint-fix → format-fix |

`lint` と `format` は glob ではなくリポジトリ全体（`oxlint .` / `oxfmt .`）を対象にしており、
`minista.config.ts` などのルート設定ファイルも検査されます。

## ディレクトリ構成

```
src/
  pages/        ファイルベースルーティング（言語別の薄いラッパー）
    index.tsx           → /
    itinerary/index.tsx → /itinerary/
    404.tsx             → /404.html
    en/...              → /en/ 配下（同じ構成）
  components/pages/  ページの実体（lang を prop で受ける）
  layouts/      index.tsx（全ページ共通の <Head>）/ Base（Header・Footer）
  components/   common・ui・primitives
  config/       env・定数・言語・ページ定義・ルート定義
  locales/      ja / en の翻訳リソース
  utils/        ロジック
  types/        共通型
  assets/css/   CSS エントリ（@layer 構成）
  assets/post-css/  デザイントークンと base / utils
  stories/      Storybook（components 配下の構造をミラー）
  tests/        Vitest（同上）
plugins/        Vite プラグイン（sitemap.xml 生成・devの末尾スラッシュ補完）
workers/        Cloudflare Worker のエントリポイント（Basic 認証・404振り分け）
public/         そのまま配信される静的ファイル
```

## 多言語対応（ja / en）

ja をデフォルトとしてプレフィックス無しで、en を `/en` 配下で公開します
（URL 設計は after_works-v006 / sugidama と同じ）。

| | ja | en |
| --- | --- | --- |
| トップ | `/` | `/en/` |
| 旅程 | `/itinerary/` | `/en/itinerary/` |
| 404 | `/404.html` | `/en/404.html` |

- **ページの追加**は `src/config/pages.ts` にパスを足し、`src/pages/` と
  `src/pages/en/` の両方にラッパーを置きます。実体は `src/components/pages/` に1つだけ
  作り、`lang` を prop で受けます。
- **翻訳**は `src/locales/{ja,en}/` に置きます。名前空間の粒度は sugidama と同じ
  （`common.json` / `pages/<ページID>.json` / `components/...`）。
- **i18next のようなランタイムは入れていません。** SSG で全ページがビルド時に確定する
  ため、`~/utils/locale` の `getDictionary(lang, ns)` でビルド時に解決しています。
  JS バンドルはゼロのままで、Storybook でもプロバイダ不要でコンポーネントを描画できます。
- **hreflang / canonical** は `src/layouts/index.tsx` が全言語 + `x-default` を出力します。
  `noindex` のページには alternate を出しません。
- **404 の言語振り分け**は `workers/handler.ts` で行います。Cloudflare の ASSETS は
  `not_found_handling` を1つしか持てないため、`/en` 配下だけ `/en/404.html` に向けています。

### ページIDの命名

サイト接頭辞は `TOAHU2026`。翻訳ファイル名（`src/locales/*/pages/<ページID>.json`）と
名前空間 `pages/<ページID>` が一致します。

| 種別 | 書式 | 例 |
| --- | --- | --- |
| 通常ページ | `TOAHU2026_<グループ>_<連番>` | `TOAHU2026_10_100`（ホーム）<br>`TOAHU2026_20_100`（旅程） |
| エラーページ | `TOAHU2026_E_<HTTPステータス>` | `TOAHU2026_E_404` |

エラーページを連番にせず HTTP ステータスで識別しているのは、404 が routable な
ページではないからです。`src/config/pages.ts` の `PAGES` には含まれず（`path` を持たず、
sitemap 対象外、`pageId` prop にもなれない）、翻訳の名前空間としてのみ存在します。
通常ページと同じ連番空間の番号を与えると同格に見えてしまうため、`E` セグメントで
番号空間を分けています。

### 末尾スラッシュ

内部リンクは `~/config/routes` が末尾スラッシュ付きのURL（`/en/`, `/itinerary/`）を返します。

minista の devサーバーはページURLを**完全一致**（`page.url === url`）でしか解決しないため、
`/en` や `/itinerary` のように末尾スラッシュ無しでアクセスすると素の 404 になります。
一方 Cloudflare の ASSETS は `html_handling`（既定 `auto-trailing-slash`）が 307 で
末尾スラッシュ付きへ飛ばします。この差を埋めるため `plugins/trailing-slash.ts`
（dev限定）が同じ 307 リダイレクトを行います。判定は既知のページURLに限定しており、
Vite の内部リクエストやアセットには触りません。

### minista の Head に関する注意

`src/layouts/index.tsx` の head タグは**フラットな配列**で組み立てて `tags` に渡しています。
minista の `HeadProvider` は `[value].flat()` で1段しか平坦化しないため、`children` に
入れ子の配列（`{LANGS.map(...)}` など）を渡すと `headTagToStr` が要素として扱えず
**エラーにならず黙ってタグが消えます**。また minista は属性名を `charSet` 以外変換しない
ので、`hrefLang` ではなく小文字の `hreflang` を `createElement` で渡しています。
どちらも `src/tests/layouts/index.test.tsx` が回帰を検出します。

## sitemap.xml / robots.txt

minista はページを必ず `.html` として書き出し、HTML を `<!doctype html>` で包むため、
`src/pages/sitemap.xml.tsx` のようなページとしては生成できません。どちらも Vite プラグインが
ビルド後に書き出します。

- **`plugins/sitemap.ts`** → `dist/sitemap.xml`。全言語 × 全ページの URL に `xhtml:link` の
  hreflang と `x-default` を付けます。404 は含めません。
- **`plugins/robots.ts`** → `dist/robots.txt`。`NO_INDEX` が空なら `Allow: /` + `Sitemap:` を、
  設定されていれば（dev）`Disallow: /` を出します。`SITE_URL` / `NO_INDEX` を参照するため
  `public/` の静的ファイルにはできません。

`plugins/` が読む `src/config/langs.ts`・`src/config/pages.ts`・`src/utils/lang.ts` は
**`~/` エイリアスを使えません**（Vite の設定ローダーがベア指定子として外部化してしまう）。
この3ファイルだけ相対インポートで書いています。

## Google Analytics

`src/layouts/index.tsx` の `createGoogleAnalyticsTags()` が gtag.js の読み込みと初期化の
2タグを出力します。**計測IDが空文字なら1つも出しません。** ID は `minista.config.ts` の
`define` でフォールバック値を持つため、`GOOGLE_ANALYTICS_ID` を渡さないローカルビルドでも
そのプロパティに送信されます（sugidama と同じ方式）。

`headTagToStr` が非空要素タグの `dangerouslySetInnerHTML` を innerHTML として扱うため、
初期化スクリプトをインラインで埋め込めます。

## 環境変数

ビルド時に `minista.config.ts` の `define` で埋め込まれます。実行時には読まれません。

| 変数                  | 用途                                                              |
| --------------------- | ----------------------------------------------------------------- |
| `NO_INDEX`            | 値があれば `noindex, nofollow` と robots.txt の `Disallow: /` を出力 |
| `SITE_URL`            | canonical / OG URL / sitemap の `loc`                             |
| `SITE_NAME`           | サイト名（title に使用）                                          |
| `GOOGLE_ANALYTICS_ID` | GA 計測ID（未指定時は固定値にフォールバック）                     |

CI では GitHub Environment の Variables から注入されます。ローカルでビルドする場合は
`.env.development.local` / `.env.production.local` に記述してください。
コードからは `~/config/env` 経由で参照します。

`vitest.config.ts` と `vite-storybook.config.ts` にも同じキーの `define` を置いています
（どちらも minista の設定を読まないため）。変数を増やしたら3か所に追加してください。

## Basic 認証

`workers/handler.ts` が全リクエストの前段で Basic 認証をかけます
（`wrangler.jsonc` の `run_worker_first: true` により静的ファイルも対象）。

`BASIC_AUTH_USER` と `BASIC_AUTH_PASS` の **両方** を設定すると有効、
両方未設定なら無効です。片方だけの設定は誤設定とみなし、全リクエストに 503 を返します。

```sh
wrangler secret put BASIC_AUTH_USER --env=development
wrangler secret put BASIC_AUTH_PASS --env=development
```

## デプロイ

`develop` / `main` への push で `.github/workflows/deploy.yml` が lint・test を
実行してから Cloudflare へデプロイします。

GitHub 側に必要な設定:

- Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Environments `development` / `production` の Variables:
  `NO_INDEX`, `SITE_URL`, `SITE_NAME`, `GOOGLE_ANALYTICS_ID`

手動デプロイの場合:

```sh
npm run deploy-development
npm run deploy-production
```

## ssg-with-react との差分

このリポジトリは `ssg-with-react` をベースにしていますが、Cloudflare 配信に合わせて
以下を変えています。

- `base: '/'`（ボイラープレートは `'./'`）。404ページは任意の深さのパスで返るため、
  相対パスだと CSS やリンクの解決が壊れます。
- `Metadata` から `rootDir` を削除し、内部リンクは `~/config/routes` の
  ルート絶対パスで組み立てます。
- ページ単位の `noindex` に加え、環境変数 `NO_INDEX` でサイト全体を noindex にできます。
- `sharp` / `brace-expansion` を `overrides` で更新しています（minista の依存に
  既知の脆弱性があるため。いずれもビルド時のみ使用）。
