import { type ReactNode } from 'react'

type LayoutWrapperProps = {
  children?: ReactNode
}

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  return <div className='LayoutWrapper'>{children}</div>
}
