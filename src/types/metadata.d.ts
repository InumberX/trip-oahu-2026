import { type Lang } from '~/types/lang'

// ssg-with-react の Metadata から rootDir を外している。内部リンクは
// ~/config/routes のルート絶対パスで組み立てるため相対深さの情報が不要。
export type Metadata = {
  title?: string
  description?: string
  layout?: string
  noindex?: boolean
  draft?: boolean
  lang?: Lang
}
