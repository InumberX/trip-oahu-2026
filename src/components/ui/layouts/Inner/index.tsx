import { type ReactNode } from 'react'

type LayoutInnerProps = {
  children?: ReactNode
  className?: string
  size?: 'medium' | 'large'
}

export const LayoutInner = ({
  children,
  className,
  size,
}: LayoutInnerProps) => {
  return (
    <div
      className={`LayoutInner${size ? ' LayoutInner--' + size : ''}${
        className ? ' ' + className : ''
      }`}
    >
      {children}
    </div>
  )
}
