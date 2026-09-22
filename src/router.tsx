import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { lenisRef } from './utils/lenis'

export const PAGES = {
  home: 'Overview',
  features: 'Features',
  solutions: 'Solutions',
  pricing: 'Pricing',
  customers: 'Customers',
  docs: 'Docs',
  login: 'Sign in',
} as const

export type PageId = keyof typeof PAGES

export const PAGE_NO: Record<PageId, string> = {
  home: '01',
  features: '02',
  solutions: '03',
  pricing: '04',
  customers: '05',
  docs: '06',
  login: '07',
}

type Veil = { target: PageId; stage: 'cover' | 'reveal' } | null

const RouterCtx = createContext<{ page: PageId; navigate: (p: PageId) => void } | null>(null)

export function useRouter() {
  const ctx = useContext(RouterCtx)
  if (!ctx) throw new Error('useRouter must be used inside RouterProvider')
  return ctx
}

const SWEEP_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

/* ------------------------------------------------------------------ */
/*  Pipeline sweep — a panel wipes across horizontally while a         */
/*  scan-line and page label ride with it. Distinct from prior sites.  */
/* ------------------------------------------------------------------ */
function PageVeil({ veil }: { veil: Veil }) {
  if (!veil) return null
  const cover = veil.stage === 'cover'

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {/* base panel wipes L→R on cover, continues off R on reveal */}
      <motion.div
        className="absolute inset-0 bg-slate-950"
        initial={{ x: '-100%' }}
        animate={{ x: cover ? '0%' : '100%' }}
        transition={{ duration: 0.66, ease: SWEEP_EASE }}
      />
      {/* mint scan edge trailing the wipe */}
      <motion.div
        className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-mint/20 to-mint/60"
        initial={{ x: '-100%' }}
        animate={{ x: cover ? 'calc(100vw - 6rem)' : '100vw' }}
        transition={{ duration: 0.66, ease: SWEEP_EASE }}
      />

      {/* centered label + node dot */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: cover ? 1 : 0 }}
        transition={{ duration: 0.3, delay: cover ? 0.34 : 0 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="flex items-center gap-5">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-mint/40 bg-mint/10">
            <motion.span
              className="h-2 w-2 rounded-full bg-mint"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </span>
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: cover ? 0 : '110%' }}
              transition={{ duration: 0.5, ease: SWEEP_EASE, delay: cover ? 0.4 : 0 }}
              className="block font-display text-4xl font-semibold text-cloud md:text-6xl"
            >
              {PAGES[veil.target]}
            </motion.span>
          </div>
          <span className="font-mono text-xs text-mint/70">{PAGE_NO[veil.target]}</span>
        </div>
      </motion.div>
    </div>
  )
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>('home')
  const [veil, setVeil] = useState<Veil>(null)
  const busy = useRef(false)

  const navigate = useCallback(
    (target: PageId) => {
      if (busy.current) return
      if (target === page) {
        lenisRef.current ? lenisRef.current.scrollTo(0, { duration: 1 }) : window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      busy.current = true
      setVeil({ target, stage: 'cover' })
      window.setTimeout(() => {
        setPage(target)
        lenisRef.current?.scrollTo(0, { immediate: true })
        window.scrollTo(0, 0)
      }, 720)
      window.setTimeout(() => setVeil({ target, stage: 'reveal' }), 1080)
      window.setTimeout(() => {
        setVeil(null)
        busy.current = false
      }, 1820)
    },
    [page]
  )

  const value = useMemo(() => ({ page, navigate }), [page, navigate])

  return (
    <RouterCtx.Provider value={value}>
      {children}
      <PageVeil veil={veil} />
    </RouterCtx.Provider>
  )
}
