import type { Transition } from 'motion/react'

/* ---------- Colour ---------- */

export type ColourToken = { token: string; swift: string; light: string; dark: string; role: string }

export const neutrals: ColourToken[] = [
  { token: 'canvas', swift: 'canvas', light: '#F5F5F7', dark: '#000000', role: 'Screen background' },
  { token: 'surface', swift: 'surface', light: '#FFFFFF', dark: '#161618', role: 'Cards, list rows, sheets' },
  { token: 'surface-2', swift: 'surfaceRaised', light: '#ECECEF', dark: '#232326', role: 'Fields, secondary buttons, bubbles' },
  { token: 'fill', swift: 'fill', light: '#E3E3E7', dark: '#2D2D31', role: 'Tracks, pressed states' },
  { token: 'line', swift: 'separator', light: '#E2E2E6', dark: '#262629', role: 'One-pixel hairlines' },
  { token: 'ink-3', swift: 'labelTertiary', light: '#A1A1A6', dark: '#5C5C62', role: 'Placeholders, disabled' },
  { token: 'ink-2', swift: 'labelSecondary', light: '#6E6E73', dark: '#98989F', role: 'Supporting text' },
  { token: 'ink', swift: 'label', light: '#0B0B0C', dark: '#F5F5F7', role: 'Text, icons, primary actions' },
]

export type Feeling = { key: string; name: string; a: string; b: string; deep: string; note: string }

/** Ordered from most to least pleasant, like the iOS State of Mind scale. */
export const feelings: Feeling[] = [
  { key: 'radiant', name: 'Radiant', a: '#F4C46A', b: '#FBE7B8', deep: '#E0A43C', note: 'Bright, full of energy' },
  { key: 'tender', name: 'Tender', a: '#EE9FB6', b: '#F9D3DE', deep: '#D97A96', note: 'Close, affectionate' },
  { key: 'calm', name: 'Calm', a: '#8FBBE3', b: '#D0E4F5', deep: '#6A9CCC', note: 'Settled, at ease' },
  { key: 'tired', name: 'Tired', a: '#B2A6DE', b: '#DDD6F3', deep: '#8F81C6', note: 'Quiet, low on energy' },
  { key: 'tense', name: 'Tense', a: '#EE9E80', b: '#F8D2C3', deep: '#D67C5C', note: 'On edge, stretched thin' },
  { key: 'low', name: 'Low', a: '#8391B5', b: '#C0C8DE', deep: '#64729A', note: 'Heavy, a bit flat' },
]

export const cycle = [
  { name: 'Period', days: 'Days 1–5', c: '#D97C93' },
  { name: 'Follicular', days: 'Days 6–13', c: '#EBA9BB' },
  { name: 'Ovulation', days: 'Days 14–16', c: '#F4CAD5' },
  { name: 'Luteal', days: 'Days 17–28', c: '#C7A5C3' },
]

export const contrast = [
  { pair: 'ink on canvas', light: '18.1', dark: '19.3' },
  { pair: 'ink-2 on canvas', light: '4.7', dark: '7.3' },
  { pair: 'ink-2 on surface', light: '5.1', dark: '6.3' },
  { pair: 'ink on feeling fills', light: '6.3+', dark: '6.3+' },
  { pair: 'alert on surface', light: '4.8', dark: '5.9' },
]

/* ---------- Typography ---------- */

export type TypeStyle = { name: string; swift: string; className: string; size: number; leading: number; tracking: number; weight: string; sample: string }

export const typeScale: TypeStyle[] = [
  { name: 'Large Title', swift: '.largeTitle.bold()', className: 'text-large-title', size: 34, leading: 41, tracking: 0.4, weight: 'Bold', sample: 'Today' },
  { name: 'Title 1', swift: '.title.weight(.semibold)', className: 'text-title-1', size: 28, leading: 34, tracking: 0.38, weight: 'Semibold', sample: '1,204 days together' },
  { name: 'Title 2', swift: '.title2.weight(.semibold)', className: 'text-title-2', size: 22, leading: 28, tracking: -0.26, weight: 'Semibold', sample: 'This weekend' },
  { name: 'Title 3', swift: '.title3.weight(.semibold)', className: 'text-title-3', size: 20, leading: 25, tracking: -0.45, weight: 'Semibold', sample: 'Dinner at Padella' },
  { name: 'Headline', swift: '.headline', className: 'text-headline', size: 17, leading: 22, tracking: -0.43, weight: 'Semibold', sample: 'Jamie checked in' },
  { name: 'Body', swift: '.body', className: 'text-body', size: 17, leading: 22, tracking: -0.43, weight: 'Regular', sample: 'Running ten minutes late. Save me a seat?' },
  { name: 'Callout', swift: '.callout', className: 'text-callout', size: 16, leading: 21, tracking: -0.31, weight: 'Regular', sample: 'You both wanted more time outdoors.' },
  { name: 'Subheadline', swift: '.subheadline', className: 'text-subhead', size: 15, leading: 20, tracking: -0.23, weight: 'Regular', sample: 'Saturday, 19:30' },
  { name: 'Footnote', swift: '.footnote', className: 'text-footnote', size: 13, leading: 18, tracking: -0.08, weight: 'Regular', sample: 'Only the two of you can see this.' },
  { name: 'Caption 1', swift: '.caption', className: 'text-caption-1', size: 12, leading: 16, tracking: 0, weight: 'Regular', sample: 'Read 09:20' },
  { name: 'Caption 2', swift: '.caption2', className: 'text-caption-2', size: 11, leading: 13, tracking: 0.06, weight: 'Regular', sample: 'Delivered' },
]

/* ---------- Space, radius ---------- */

export const spacing = [
  { token: 's1', value: 4, use: 'Icon to label' },
  { token: 's2', value: 8, use: 'Related items' },
  { token: 's3', value: 12, use: 'Inside rows' },
  { token: 's4', value: 16, use: 'Card padding' },
  { token: 's5', value: 20, use: 'Screen margin' },
  { token: 's6', value: 24, use: 'Between cards' },
  { token: 's8', value: 32, use: 'Between sections' },
  { token: 's12', value: 48, use: 'Breathing room' },
  { token: 's16', value: 64, use: 'Hero spacing' },
]

export const radii = [
  { token: 'xs', value: 6, use: 'Badges' },
  { token: 'sm', value: 10, use: 'Thumbnails' },
  { token: 'md', value: 14, use: 'Buttons, fields' },
  { token: 'lg', value: 20, use: 'Cards, lists' },
  { token: 'xl', value: 28, use: 'Panels' },
  { token: 'sheet', value: 38, use: 'Sheets' },
]

export const layout = [
  { label: 'Screen margin', value: '20' },
  { label: 'Card padding', value: '16' },
  { label: 'Hit target', value: '44 × 44' },
  { label: 'Row height', value: '52' },
  { label: 'Tab bar', value: '62, floating' },
  { label: 'Hairline', value: '1 px' },
]

/* ---------- Motion ---------- */

/**
 * Springs use SwiftUI's response + damping fraction, converted for Motion on the web:
 *   stiffness = (2π / response)²,  damping = 4π · dampingFraction / response   (mass = 1)
 */
function spring(response: number, dampingFraction: number): Transition {
  return { type: 'spring', stiffness: (2 * Math.PI / response) ** 2, damping: (4 * Math.PI * dampingFraction) / response, mass: 1 }
}

export const motion = {
  snappy: spring(0.3, 0.86),
  smooth: spring(0.45, 1),
  gentle: spring(0.8, 1),
  /** Liquid Glass press and morph: a little give, like a droplet. */
  liquid: spring(0.38, 0.64),
  fade: { duration: 0.24, ease: [0.2, 0, 0, 1] } as Transition,
} as const

export type SpringKey = 'snappy' | 'smooth' | 'gentle' | 'liquid'

export type MotionToken = { key: keyof typeof motion | 'drift'; name: string; swift: string; response?: number; damping?: number; spec: string; use: string }

export const motionTokens: MotionToken[] = [
  { key: 'snappy', name: 'Snappy', swift: '.spring(response: 0.3, dampingFraction: 0.86)', response: 0.3, damping: 0.86, spec: '0.30 s · 0.86', use: 'Under the finger. Presses, switches, selection.' },
  { key: 'smooth', name: 'Smooth', swift: '.spring(response: 0.45, dampingFraction: 1)', response: 0.45, damping: 1, spec: '0.45 s · 1.00', use: 'Sheets, layout changes, messages arriving.' },
  { key: 'gentle', name: 'Gentle', swift: '.spring(response: 0.8, dampingFraction: 1)', response: 0.8, damping: 1, spec: '0.80 s · 1.00', use: 'Content settling in, feelings changing colour.' },
  { key: 'drift', name: 'Drift', swift: '.easeInOut(duration: 9).repeatForever()', spec: '9 s · loop', use: 'Ambient only. Shimmer, breathing orbs. One per screen.' },
]

export function sampleSpring(response: number, z: number, seconds = 1.2, steps = 120) {
  const w = (2 * Math.PI) / response
  const pts: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * seconds
    let x: number
    if (z < 1) {
      const wd = w * Math.sqrt(1 - z * z)
      x = 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t))
    } else x = 1 - Math.exp(-w * t) * (1 + w * t)
    pts.push([t / seconds, x])
  }
  return pts
}

export const haptics = [
  { moment: 'Switch, reaction', haptic: '.impact(weight: .light)' },
  { moment: 'Segmented, feeling slider step', haptic: '.selection' },
  { moment: 'Check-in sent', haptic: '.success' },
  { moment: 'Long-press menu opens', haptic: '.impact(weight: .medium)' },
  { moment: 'Destructive confirm', haptic: '.warning' },
]
