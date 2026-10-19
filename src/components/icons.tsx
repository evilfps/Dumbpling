import type { ReactNode } from 'react'

/**
 * Dumbpling glyphs. Drawn on a 24 pt grid with a 20 pt live area, round caps and joins.
 * Stroke weight follows the text weight beside it, like SF Symbols.
 * In the iOS app, use the SF Symbol named in `sf`; these exist for brand surfaces and this reference.
 */
type Glyph = { sf: string; outline: ReactNode; filled?: ReactNode }

const dot = (cx: number, cy: number, r = 1.1) => <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />

const bubble = 'M12 4.25c4.83 0 8.5 3.16 8.5 7.12 0 3.97-3.67 7.13-8.5 7.13-.95 0-1.86-.12-2.72-.35-1.03.84-2.6 1.6-4.53 1.85.62-.83 1.07-1.83 1.2-2.94C4.4 15.76 3.5 13.68 3.5 11.37 3.5 7.41 7.17 4.25 12 4.25Z'
const heart = 'M12 19.25c-.3 0-7.75-4.35-7.75-10A4.25 4.25 0 0 1 12 6.9a4.25 4.25 0 0 1 7.75 2.35c0 5.65-7.45 10-7.75 10Z'
const drop = 'M12 3.5s6 6.2 6 10.75a6 6 0 0 1-12 0C6 9.7 12 3.5 12 3.5Z'

export const glyphs = {
  today: {
    sf: 'sun.horizon',
    outline: (
      <>
        <path d="M6.25 16.25a5.75 5.75 0 0 1 11.5 0" />
        <path d="M3.5 16.25h17M8.5 19.75h7M12 5v2M5.6 8.6 7 10M18.4 8.6 17 10" />
      </>
    ),
    filled: (
      <>
        <path d="M6.25 16.25a5.75 5.75 0 0 1 11.5 0Z" fill="currentColor" />
        <path d="M3.5 16.25h17M8.5 19.75h7M12 5v2M5.6 8.6 7 10M18.4 8.6 17 10" />
      </>
    ),
  },
  messages: { sf: 'message', outline: <path d={bubble} />, filled: <path d={bubble} fill="currentColor" /> },
  plans: {
    sf: 'calendar',
    outline: (
      <>
        <rect x="3.75" y="5.25" width="16.5" height="15" rx="3.5" />
        <path d="M3.75 9.75h16.5M8.25 3.5v3.5M15.75 3.5v3.5" />
        {dot(12, 14.75)}
      </>
    ),
    filled: (
      <>
        <rect x="3.75" y="5.25" width="16.5" height="15" rx="3.5" />
        <path d="M3.75 9.75v-1a3.5 3.5 0 0 1 3.5-3.5h9.5a3.5 3.5 0 0 1 3.5 3.5v1Z" fill="currentColor" />
        <path d="M8.25 3.5v3.5M15.75 3.5v3.5" />
        {dot(12, 14.75, 1.3)}
      </>
    ),
  },
  us: {
    sf: 'circle.circle',
    outline: (
      <>
        <circle cx="9" cy="12" r="5.75" />
        <circle cx="15" cy="12" r="5.75" />
      </>
    ),
    filled: (
      <>
        <circle cx="9" cy="12" r="5.75" fill="currentColor" />
        <circle cx="15" cy="12" r="5.75" />
      </>
    ),
  },
  heart: { sf: 'heart', outline: <path d={heart} />, filled: <path d={heart} fill="currentColor" /> },
  drop: { sf: 'drop', outline: <path d={drop} />, filled: <path d={drop} fill="currentColor" /> },
  bell: {
    sf: 'bell',
    outline: (
      <>
        <path d="M6.5 16v-5a5.5 5.5 0 0 1 11 0v5l1.5 1.75H5L6.5 16Z" />
        <path d="M10 20.25a2.1 2.1 0 0 0 4 0" />
      </>
    ),
  },
  moon: { sf: 'moon', outline: <path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1Z" /> },
  sun: {
    sf: 'sun.max',
    outline: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v1.75M12 19.25V21M3 12h1.75M19.25 12H21M5.64 5.64l1.24 1.24M17.12 17.12l1.24 1.24M5.64 18.36l1.24-1.24M17.12 6.88l1.24-1.24" />
      </>
    ),
  },
  pin: {
    sf: 'mappin',
    outline: (
      <>
        <path d="M12 20.75s-6.25-5.6-6.25-10.5a6.25 6.25 0 0 1 12.5 0c0 4.9-6.25 10.5-6.25 10.5Z" />
        <circle cx="12" cy="10.25" r="2.25" />
      </>
    ),
  },
  lock: {
    sf: 'lock',
    outline: (
      <>
        <rect x="5.25" y="10.5" width="13.5" height="10" rx="2.75" />
        <path d="M8.5 10.5V7.75a3.5 3.5 0 0 1 7 0v2.75" />
      </>
    ),
  },
  clock: {
    sf: 'clock',
    outline: (
      <>
        <circle cx="12" cy="12" r="8.25" />
        <path d="M12 7.75V12l2.75 1.75" />
      </>
    ),
  },
  search: {
    sf: 'magnifyingglass',
    outline: (
      <>
        <circle cx="10.75" cy="10.75" r="6.25" />
        <path d="m15.4 15.4 4.35 4.35" />
      </>
    ),
  },
  mic: {
    sf: 'mic',
    outline: (
      <>
        <rect x="9" y="3.5" width="6" height="10.5" rx="3" />
        <path d="M5.75 11a6.25 6.25 0 0 0 12.5 0M12 17.25v3.25" />
      </>
    ),
  },
  camera: {
    sf: 'camera',
    outline: (
      <>
        <path d="M4 9.25A2.25 2.25 0 0 1 6.25 7h1.6l1.4-2h5.5l1.4 2h1.6A2.25 2.25 0 0 1 20 9.25v8.5A2.25 2.25 0 0 1 17.75 20H6.25A2.25 2.25 0 0 1 4 17.75Z" />
        <circle cx="12" cy="13.25" r="3.5" />
      </>
    ),
  },
  pencil: {
    sf: 'pencil',
    outline: <path d="M14.75 5.75 18.25 9.25M16.5 4a2.47 2.47 0 0 1 3.5 3.5L9 18.5l-4.5 1 1-4.5Z" />,
  },
  trash: {
    sf: 'trash',
    outline: <path d="M4.75 7h14.5M9.75 7V5.25h4.5V7M6.5 7l.85 11.4a1.75 1.75 0 0 0 1.75 1.6h5.8a1.75 1.75 0 0 0 1.75-1.6L17.5 7" />,
  },
  gallery: {
    sf: 'square.grid.2x2',
    outline: (
      <>
        <rect x="3.75" y="3.75" width="7" height="9.5" rx="2" />
        <rect x="13.25" y="3.75" width="7" height="6" rx="2" />
        <rect x="3.75" y="15.75" width="7" height="4.5" rx="2" />
        <rect x="13.25" y="12.25" width="7" height="8" rx="2" />
      </>
    ),
    filled: (
      <g fill="currentColor">
        <rect x="3.75" y="3.75" width="7" height="9.5" rx="2" />
        <rect x="13.25" y="3.75" width="7" height="6" rx="2" />
        <rect x="3.75" y="15.75" width="7" height="4.5" rx="2" />
        <rect x="13.25" y="12.25" width="7" height="8" rx="2" />
      </g>
    ),
  },
  snap: {
    sf: 'square',
    outline: <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" />,
    filled: <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" fill="currentColor" />,
  },
  water: {
    sf: 'waterbottle',
    outline: (
      <>
        <path d="M6 4.5h12l-1.4 14.1a2 2 0 0 1-2 1.9H9.4a2 2 0 0 1-2-1.9L6 4.5Z" />
        <path d="M6.7 10.25c1.77-.9 3.53-.9 5.3 0s3.53.9 5.3 0" />
      </>
    ),
    filled: (
      <>
        <path d="M6 4.5h12l-1.4 14.1a2 2 0 0 1-2 1.9H9.4a2 2 0 0 1-2-1.9L6 4.5Z" />
        <path d="M6.7 10.25c1.77-.9 3.53-.9 5.3 0s3.53.9 5.3 0l-.75 8.35a2 2 0 0 1-2 1.9h-5.1a2 2 0 0 1-2-1.9Z" fill="currentColor" />
      </>
    ),
  },
  flash: { sf: 'bolt', outline: <path d="M13 3.5 6.5 13.25h5L11 20.5l6.5-9.75h-5L13 3.5Z" /> },
  flip: { sf: 'arrow.triangle.2.circlepath', outline: <path d="M4.5 12a7.5 7.5 0 0 1 13.2-4.9M19.5 12a7.5 7.5 0 0 1-13.2 4.9M18.25 3.75v3.6h-3.6M5.75 20.25v-3.6h3.6" /> },
  share: { sf: 'square.and.arrow.up', outline: <path d="M12 14.5V3.75M8 7.5l4-3.75 4 3.75M8.5 10.5H7a2.5 2.5 0 0 0-2.5 2.5v5A2.5 2.5 0 0 0 7 20.5h10a2.5 2.5 0 0 0 2.5-2.5v-5a2.5 2.5 0 0 0-2.5-2.5h-1.5" /> },
  flashlight: { sf: 'flashlight.off.fill', outline: <path d="M8.5 3.75h7v3l-1.75 3.5v9.25a.75.75 0 0 1-.75.75h-2a.75.75 0 0 1-.75-.75v-9.25L8.5 6.75Zm0 3h7" /> },
  plus: { sf: 'plus', outline: <path d="M12 5v14M5 12h14" /> },
  minus: { sf: 'minus', outline: <path d="M5 12h14" /> },
  check: { sf: 'checkmark', outline: <path d="M5.25 12.75 9.75 17.25 18.75 7.25" /> },
  close: { sf: 'xmark', outline: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /> },
  arrowUp: { sf: 'arrow.up', outline: <path d="M12 19V5.5M6.25 11.25 12 5.5l5.75 5.75" /> },
  chevronLeft: { sf: 'chevron.left', outline: <path d="M14.5 5 7.5 12l7 7" /> },
  chevronRight: { sf: 'chevron.right', outline: <path d="M9.5 5.5 16 12l-6.5 6.5" /> },
  chevronDown: { sf: 'chevron.down', outline: <path d="M6 9.5l6 6 6-6" /> },
  ellipsis: {
    sf: 'ellipsis',
    outline: (
      <>
        {dot(5.5, 12, 1.5)}
        {dot(12, 12, 1.5)}
        {dot(18.5, 12, 1.5)}
      </>
    ),
  },
  copy: {
    sf: 'doc.on.doc',
    outline: (
      <>
        <rect x="8.75" y="8.75" width="11.5" height="11.5" rx="2.75" />
        <path d="M15.25 8.75v-2a3 3 0 0 0-3-3h-5.5a3 3 0 0 0-3 3v5.5a3 3 0 0 0 3 3h2" />
      </>
    ),
  },
  play: {
    sf: 'play.fill',
    outline: <path d="M8 5.75v12.5a.75.75 0 0 0 1.14.64l10.2-6.25a.75.75 0 0 0 0-1.28L9.14 5.11A.75.75 0 0 0 8 5.75Z" fill="currentColor" />,
  },
  replay: {
    sf: 'arrow.counterclockwise',
    outline: <path d="M5 12a7 7 0 1 0 2.05-4.95M5 4.5v3.25h3.25" />,
  },
} satisfies Record<string, Glyph>

export type IconName = keyof typeof glyphs

const weights = { light: 1.3, regular: 1.6, medium: 1.85, semibold: 2.1, bold: 2.4 }

export function Icon({
  name,
  size = 24,
  weight = 'regular',
  filled,
  className,
}: {
  name: IconName
  size?: number
  weight?: keyof typeof weights
  filled?: boolean
  className?: string
}) {
  const g: Glyph = glyphs[name]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={weights[weight]}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {filled && g.filled ? g.filled : g.outline}
    </svg>
  )
}
