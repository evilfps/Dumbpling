import { motion } from 'motion/react'
import { feelings } from '../tokens'
import { useReduce } from './ios'

const tender = feelings[1]
const calm = feelings[2]
const orb = (f: (typeof feelings)[number]) => `radial-gradient(circle at 34% 28%, ${f.b} 0%, ${f.a} 52%, ${f.deep} 100%)`

/** Two people, overlapping. Where they meet, the light adds up. */
export function LogoMark({ size = 24, breathe }: { size?: number; breathe?: boolean }) {
  const reduce = useReduce()
  const drift = breathe && !reduce
  const loop = { duration: 4.5, ease: 'easeInOut' as const, repeat: Infinity, repeatType: 'mirror' as const }
  return (
    <span className="relative inline-block shrink-0" style={{ width: size * 1.5, height: size }} aria-hidden>
      <motion.span
        className="absolute left-0 top-0 rounded-full"
        style={{ width: size, height: size, background: orb(tender) }}
        animate={drift ? { x: [0, size * 0.06] } : undefined}
        transition={loop}
      />
      <motion.span
        className="absolute right-0 top-0 rounded-full mix-blend-multiply dark:mix-blend-screen"
        style={{ width: size, height: size, background: orb(calm) }}
        animate={drift ? { x: [0, -size * 0.06] } : undefined}
        transition={loop}
      />
    </span>
  )
}
