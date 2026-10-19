import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useInView } from 'motion/react'
import { Icon } from './icons'
import { cx } from './ios'
import { motion as m } from '../tokens'

/** Content settles in once as it scrolls into view: fade, 8 pt rise, slight blur. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } } : undefined}
      transition={{ ...m.gentle, delay }}
    >
      {children}
    </motion.div>
  )
}

export function Section({ id, index, title, intro, children }: { id: string; index: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 py-28 first:pt-0">
      <Reveal className="mb-16 grid gap-6 md:grid-cols-[1fr_1.15fr] md:items-end">
        <div>
          <p className="tnum mb-4 font-mono text-[12px] text-ink-3">{index}</p>
          <h2 className="text-lit pb-1 text-[44px] font-semibold leading-[48px] tracking-[-0.035em]">{title}</h2>
        </div>
        {intro && <p className="max-w-[520px] text-[17px] leading-[26px] tracking-[-0.012em] text-ink-2">{intro}</p>}
      </Reveal>
      <div className="flex flex-col gap-24">{children}</div>
    </section>
  )
}

export function Block({ title, description, children, aside }: { title: string; description?: ReactNode; children: ReactNode; aside?: ReactNode }) {
  return (
    <Reveal>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-[560px]">
          <h3 className="text-[21px] font-semibold leading-[26px] tracking-[-0.02em] text-ink">{title}</h3>
          {description && <p className="mt-2 text-[15px] leading-[22px] tracking-[-0.01em] text-ink-2">{description}</p>}
        </div>
        {aside}
      </div>
      {children}
    </Reveal>
  )
}

/** A quiet panel for live components. Mirrors the iOS canvas. */
export function Stage({ children, className, caption, style }: { children: ReactNode; className?: string; caption?: ReactNode; style?: CSSProperties }) {
  return (
    <figure className="flex flex-col gap-3">
      <div className={cx('relative rounded-[28px] bg-stage p-8 dark:shadow-[inset_0_0_0_0.5px_rgb(255_255_255/0.07)]', className)} style={{ ['--chat-bg' as string]: 'var(--stage)', ...style }}>
        {children}
      </div>
      {caption && <figcaption className="px-1 text-footnote text-ink-3">{caption}</figcaption>}
    </figure>
  )
}

export function Spec({ children }: { children: ReactNode }) {
  return <code className="tnum whitespace-nowrap font-mono text-[11.5px] text-ink-2">{children}</code>
}

/** Hairline-divided rows. The default table for specs. */
export function Rows({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-line border-y border-line">{children}</div>
}

/** Do / avoid marker. Circle and glyph are one 16 pt drawing so the mark is optically centred. */
function Mark({ kind }: { kind: 'do' | 'dont' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="block" aria-hidden>
      <circle cx="8" cy="8" r="8" fill={kind === 'do' ? 'var(--live)' : 'var(--alert)'} />
      <path
        d={kind === 'do' ? 'M4.75 8.25 6.9 10.4 11.25 5.85' : 'M5.5 5.5l5 5M10.5 5.5l-5 5'}
        fill="none"
        stroke="#fff"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Note({ kind, children }: { kind: 'do' | 'dont'; children: ReactNode }) {
  return (
    <p className="flex gap-2.5 text-subhead text-ink-2">
      <span className="flex h-5 shrink-0 items-center">
        <Mark kind={kind} />
      </span>
      <span>
        <span className="font-medium text-ink">{kind === 'do' ? 'Do' : 'Avoid'}</span> · {children}
      </span>
    </p>
  )
}

export function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="overflow-hidden rounded-[28px] bg-[#0c0c0d] text-[#e8e8ea] shadow-[inset_0_0_0_0.5px_rgb(255_255_255/0.08)]">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="font-mono text-[12px] text-white/45">{language}</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1600)
          }}
          className="flex h-8 items-center gap-1.5 rounded-full bg-white/[0.06] px-3 text-footnote font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Icon name={copied ? 'check' : 'copy'} size={14} weight="medium" />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="no-scrollbar max-h-[600px] overflow-auto px-6 pb-6 font-mono text-[12.5px] leading-[21px]">
        <code>{code}</code>
      </pre>
    </div>
  )
}
