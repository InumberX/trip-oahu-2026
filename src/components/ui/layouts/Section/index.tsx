import { type ReactNode } from 'react'

type LayoutSectionProps = {
  children?: ReactNode
  isNotSection?: boolean
  className?: string
  size?: 'large'
}

export const LayoutSection = ({
  children,
  isNotSection,
  className,
  size,
}: LayoutSectionProps) => {
  // div / section のどちらでも同じクラス名を使うため一度だけ組み立てる
  const layoutSectionClassName = `LayoutSection${
    className ? ' ' + className : ''
  }${size ? ' LayoutSection--' + size : ''}`

  return isNotSection ? (
    <div className={layoutSectionClassName}>{children}</div>
  ) : (
    <section className={layoutSectionClassName}>{children}</section>
  )
}
