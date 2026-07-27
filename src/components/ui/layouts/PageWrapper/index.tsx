import { type ReactNode } from 'react'

type LayoutPageWrapperProps = {
  children?: ReactNode
}

export const LayoutPageWrapper = ({ children }: LayoutPageWrapperProps) => {
  return <div className='LayoutPageWrapper'>{children}</div>
}
