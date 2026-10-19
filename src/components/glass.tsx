import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { cx, useReduce, useSpring } from './ios'

export type GlassVariant = 'regular' | 'clear' | 'sheet' | 'prominent'

const variantClass: Record<GlassVariant, string> = {
  regular: 'lg',
  clear: 'lg lg-clear',
  sheet: 'lg lg-sheet',
  prominent: '',
}

/** Tracks the pointer so the light blooms from where you touch, as iOS 26 glass does. */
function useLight() {
  const ref = useRef<HTMLElement>(null)
  const onPointerMove = (e: PointerEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--lg-x', `${e.clientX - r.left}px`)
    el.style.setProperty('--lg-y', `${e.clientY - r.top}px`)
  }
  return { ref, onPointerMove, onPointerDown: onPointerMove }
}

/**
 * Liquid Glass surface. `interactive` adds the press response: it swells by 4%,
 * brightens from the touch point, then settles with the liquid spring.
 * SwiftUI: .glassEffect(.regular.interactive(), in: .capsule)
 */
export function Glass({
  variant = 'regular',
  interactive,
  className,
  style,
  children,
  onClick,
  as = 'div',
  label,
}: {
  variant?: GlassVariant
  interactive?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
  onClick?: () => void
  as?: 'div' | 'button'
  label?: string
}) {
  const light = useLight()
  const liquid = useSpring('liquid')
  const reduce = useReduce()
  const Comp = as === 'button' ? motion.button : motion.div
  const prominent = variant === 'prominent'
  return (
    <Comp
      ref={light.ref as never}
      type={as === 'button' ? 'button' : undefined}
      aria-label={label}
      onClick={onClick}
      onPointerMove={interactive ? light.onPointerMove : undefined}
      onPointerDown={interactive ? light.onPointerDown : undefined}
      whileTap={interactive ? (reduce ? { opacity: 0.8 } : { scale: 1.04 }) : undefined}
      transition={liquid}
      className={cx(variantClass[variant], prominent && 'lg', interactive && 'lg-interactive select-none', className)}
      style={prominent ? { ...style, ['--lg-tint' as string]: 'var(--ink)', color: 'var(--page)' } : style}
    >
      {interactive && <span className="lg-light" aria-hidden />}
      {children}
    </Comp>
  )
}
