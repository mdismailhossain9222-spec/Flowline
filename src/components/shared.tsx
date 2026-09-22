import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '../utils/cn'

export const EASE: [number, number, number, number] = [0.22, 1, 0.28, 1]

/* ---------------- eyebrow chip ---------------- */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.6, ease: EASE }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-mist',
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-dot" />
      {children}
    </motion.span>
  )
}

/* ---------------- headline reveal ---------------- */
export function Heading({
  children,
  className,
  as: Tag = 'h2',
}: {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-14%' }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <Tag className={cn('font-display font-semibold tracking-[-0.02em] text-cloud', className)}>
        {children}
      </Tag>
    </motion.div>
  )
}

/* ---------------- generic reveal ---------------- */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ---------------- buttons ---------------- */
export function Button({
  label,
  onClick,
  variant = 'primary',
  className,
  icon = true,
}: {
  label: string
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'outline'
  className?: string
  icon?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300',
        variant === 'primary' &&
          'bg-mint text-[#05221a] hover:shadow-[0_0_36px_-6px_rgba(78,240,176,0.6)] hover:brightness-105',
        variant === 'outline' && 'border border-line bg-panel/40 text-cloud hover:border-mint/50 hover:bg-panel',
        variant === 'ghost' && 'text-cloud hover:text-mint',
        className
      )}
    >
      {label}
      {icon && (
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </button>
  )
}

/* ---------------- counter ---------------- */
export function Counter({
  value,
  suffix = '',
  prefix = '',
  className,
  decimals = 0,
}: {
  value: number
  suffix?: string
  prefix?: string
  className?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const spring = useSpring(0, { stiffness: 55, damping: 20 })
  const text = useTransform(spring, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`)
  useEffect(() => {
    if (inView) spring.set(value)
  }, [inView, spring, value])
  return (
    <span ref={ref} className={className}>
      <motion.span>{text}</motion.span>
    </span>
  )
}

/* ---------------- glass panel ---------------- */
export function Panel({
  children,
  className,
  glow = false,
}: {
  children: ReactNode
  className?: string
  glow?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-panel/50 backdrop-blur-sm',
        glow && 'shadow-[0_0_60px_-30px_rgba(78,240,176,0.4)]',
        className
      )}
    >
      {children}
    </div>
  )
}

/* ---------------- page masthead ---------------- */
export function PageHead({
  no,
  kicker,
  title,
  accent,
  sub,
}: {
  no: string
  kicker: string
  title: string
  accent?: string
  sub?: string
}) {
  return (
    <header className="relative overflow-hidden border-b border-line px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
      <div className="grid-fade absolute inset-0 opacity-70" />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-mint">{no}</span>
          <span className="h-px w-10 bg-line" />
          <Kicker>{kicker}</Kicker>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="mt-7 max-w-4xl font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-cloud"
        >
          {title}
          {accent && <span className="text-mint"> {accent}</span>}
        </motion.h1>
        {sub && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg"
          >
            {sub}
          </motion.p>
        )}
      </div>
    </header>
  )
}

/* ---------------- logo cloud row ---------------- */
export function LogoRow({ names }: { names: string[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-16">
      {names.map((n, i) => (
        <motion.span
          key={n}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.07 }}
          className="font-display text-lg font-semibold tracking-tight text-mist transition-opacity hover:!opacity-100 md:text-xl"
        >
          {n}
        </motion.span>
      ))}
    </div>
  )
}
