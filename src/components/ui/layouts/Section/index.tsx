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
  return isNotSection ? (
    <div
      className={`LayoutSection${className ? ' ' + className : ''}${
        size ? ' LayoutSection--' + size : ''
      }`}
    >
      {children}
    </div>
  ) : (
    <section
      className={`LayoutSection${className ? ' ' + className : ''}${
        size ? ' LayoutSection--' + size : ''
      }`}
    >
      {children}
    </section>
  )
}
