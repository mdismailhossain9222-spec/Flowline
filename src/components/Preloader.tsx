import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { EASE } from './shared'

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let v = 0
    const id = window.setInterval(() => {
      v += Math.floor(Math.random() * 6) + 3
      if (v >= 100) {
        v = 100
        window.clearInterval(id)
        window.setTimeout(onDone, 440)
      }
      setCount(v)
    }, 32)
    return () => window.clearInterval(id)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="grid-fade absolute inset-0 opacity-60" />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative flex items-center gap-3"
      >
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-mint text-[#05221a] glow-mint">
          <Zap size={24} strokeWidth={2.5} fill="currentColor" />
        </span>
        <span className="font-display text-4xl font-bold tracking-tight text-cloud">Flowline</span>
      </motion.div>

      {/* progress rail */}
      <div className="relative mt-10 h-px w-64 overflow-hidden bg-line">
        <motion.div
          className="absolute inset-y-0 left-0 bg-mint"
          style={{ width: `${count}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>
      <div className="mt-4 flex w-64 items-center justify-between font-mono text-[11px] text-mist">
        <span>initialising workflow engine</span>
        <span className="text-mint tabular-nums">{count}%</span>
      </div>
    </motion.div>
  )
}
