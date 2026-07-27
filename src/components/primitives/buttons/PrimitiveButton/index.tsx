import { type AriaRole, type AriaAttributes, type ReactNode } from 'react'

import type { ButtonType, AnchorTarget, AnchorRel } from '~/types/html'

export type PrimitiveButtonProps = {
  url?: string
  target?: AnchorTarget
  rel?: AnchorRel
  buttonType?: ButtonType
  isDisabled?: boolean
  className?: string
  children?: ReactNode
  name?: string
  value?: string
  title?: string
  role?: AriaRole
  tabIndex?: number
  ariaLabel?: AriaAttributes['aria-label']
  ariaControls?: AriaAttributes['aria-controls']
  ariaSelected?: AriaAttributes['aria-selected']
}

export const PrimitiveButton = ({
  url,
  target,
  rel,
  buttonType = 'button',
  isDisabled,
  className,
  children,
  name,
  value,
  title,
  role,
  tabIndex,
  ariaLabel,
  ariaControls,
  ariaSelected,
}: PrimitiveButtonProps) => {
  const primitiveButtonClassName = `PrimitiveButton${isDisabled ? ' PrimitiveButton--disabled' : ''}${className ? ' ' + className : ''}`

  return url ? (
    <a
      href={url}
      target={target}
      rel={rel}
      className={primitiveButtonClassName}
      title={title}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-controls={ariaControls}
      aria-selected={ariaSelected}
    >
      {children}
    </a>
  ) : (
    <button
      type={buttonType}
      disabled={isDisabled}
      className={primitiveButtonClassName}
      name={name}
      value={value}
      title={title}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-controls={ariaControls}
      aria-selected={ariaSelected}
    >
      {children}
    </button>
  )
}
