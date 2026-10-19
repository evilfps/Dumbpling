import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { TabBar } from './ios'

/** Soft blur that appears under the bar as content scrolls beneath it (iOS 26 scroll edge effect). */
export function ScrollEdge({ opacity, height = 110 }: { opacity: ReturnType<typeof useTransform<number, number>> | number; height?: number }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-canvas via-canvas/70 to-transparent backdrop-blur-[6px]"
      style={{ height, opacity, maskImage: 'linear-gradient(to bottom, black 55%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent)' }}
    />
  )
}

/**
 * Navigation scaffold: large title that hands off to an inline title,
 * glass bar buttons, and a tab bar that minimises while scrolling down.
 */
export function LargeTitleScreen({
  title,
  subtitle,
  leading,
  trailing,
  children,
  tab,
  accessory,
  overlay,
  tabBar = true,
}: {
  title: string
  subtitle?: string
  leading?: ReactNode
  trailing?: ReactNode
  children: ReactNode
  tab: string
  accessory?: ReactNode
  overlay?: ReactNode
  /** Pushed screens hide the tab bar, like hidesBottomBarWhenPushed. */
  tabBar?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ container: ref })
  const bar = useTransform(scrollY, [24, 56], [0, 1])
  const big = useTransform(scrollY, [0, 40], [1, 0])
  const [tabState, setTab] = useState(tab)
  const [min, setMin] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    if (v > 140 && v > prev + 4) setMin(true)
    else if (v < prev - 4 || v < 60) setMin(false)
  })

  return (
    <>
      <ScrollEdge opacity={bar} />
      <div className="absolute inset-x-0 top-[54px] z-40 grid h-11 grid-cols-[1fr_auto_1fr] items-center px-4">
        <span className="flex">{leading}</span>
        <motion.span className="text-headline text-ink" style={{ opacity: bar }}>
          {title}
        </motion.span>
        <span className="flex justify-end">{trailing}</span>
      </div>
      <div ref={ref} className="no-scrollbar relative h-full overflow-y-auto overscroll-contain">
        <div className={tabBar ? 'px-4 pb-40 pt-[98px]' : 'px-4 pb-16 pt-[98px]'}>
          <motion.div className="mb-5 px-1" style={{ opacity: big }}>
            <h1 className="text-large-title text-ink">{title}</h1>
            {subtitle && <p className="text-subhead text-ink-2">{subtitle}</p>}
          </motion.div>
          {children}
        </div>
      </div>
      {tabBar && <TabBar active={tabState} onChange={setTab} minimized={min} accessory={accessory} />}
      {overlay}
    </>
  )
}
