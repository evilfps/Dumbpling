import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { feelings } from '../tokens'
import { useReduce, useSpring } from './ios'

const calm = feelings[2]

/** A gentle sine, two periods wide, that scrolls sideways forever. */
function Wave({ opacity, duration, offset = 0 }: { opacity: number; duration: number; offset?: number }) {
  const reduce = useReduce()
  const d = 'M0 10 Q 25 0 50 10 T 100 10 T 150 10 T 200 10 V 30 H 0 Z'
  return (
    <svg
      viewBox="0 0 200 30"
      preserveAspectRatio="none"
      className="absolute -top-[13px] left-0 h-[14px] w-[200%]"
      style={{ opacity, animation: reduce ? undefined : `wave ${duration}s linear infinite`, animationDelay: `${offset}s` }}
      aria-hidden
    >
      <path d={d} fill={calm.a} />
    </svg>
  )
}

/** Water level for hydration. Uses the Calm hue: water belongs to the body palette. */
export function Vessel({ value, goal = 8, width = 150, height = 236 }: { value: number; goal?: number; width?: number; height?: number }) {
  const gentle = useSpring('gentle')
  const level = Math.min(1, value / goal)
  return (
    <div className="relative overflow-hidden bg-surface-2" style={{ width, height, borderRadius: width * 0.32 }} role="img" aria-label={`${value} of ${goal} glasses`}>
      <motion.div
        className="absolute inset-x-0 bottom-0"
        style={{ background: `linear-gradient(180deg, ${calm.a}, ${calm.deep})` }}
        initial={false}
        animate={{ height: `${level * 100}%` }}
        transition={gentle}
      >
        <Wave opacity={0.45} duration={7} offset={-2} />
        <Wave opacity={1} duration={5} />
      </motion.div>
      <div className="pointer-events-none absolute inset-0" style={{ borderRadius: 'inherit', boxShadow: 'inset 0 0 0 0.5px rgb(255 255 255 / 0.2), inset 10px 0 20px -12px rgb(255 255 255 / 0.7), inset -6px 0 16px -12px rgb(0 0 0 / 0.2)' }} />
      <span className="pointer-events-none absolute left-[14%] top-[10%] h-[34%] w-[7%] rounded-full bg-white/40 blur-[1px]" />
    </div>
  )
}

/** Lock Screen / widget gauge (accessoryCircularCapacity). */
export function Gauge({ value, goal = 8, size = 72, stroke = 6, color = 'currentColor', track = 'rgb(255 255 255 / 0.25)', children }: { value: number; goal?: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const arc = 0.78
  const smooth = useSpring('smooth')
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 rotate-[129.6deg]" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${c * arc} ${c}`} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={false}
          animate={{ strokeDasharray: `${c * arc * Math.min(1, value / goal)} ${c}` }}
          transition={smooth}
        />
      </svg>
      <div className="relative">{children}</div>
    </div>
  )
}
