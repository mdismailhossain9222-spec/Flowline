import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/* rounded cursor with a soft mint glow ring — matches the SaaS feel */
export default function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 300, damping: 26, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 300, damping: 26, mass: 0.5 })
  const [hot, setHot] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      setHot(!!t?.closest('a, button, input, select, textarea, label, [data-hover]'))
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [x, y])

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[96] hidden h-1.5 w-1.5 rounded-full bg-mint lg:block"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[95] hidden h-9 w-9 rounded-full border border-mint/50 lg:block"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: hot ? 1.7 : 1, opacity: hot ? 1 : 0.5, borderColor: hot ? 'rgba(78,240,176,0.9)' : 'rgba(78,240,176,0.4)' }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </>
  )
}
