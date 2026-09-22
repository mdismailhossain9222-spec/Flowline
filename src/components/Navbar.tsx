import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Menu, X, Zap } from 'lucide-react'
import { cn } from '../utils/cn'
import { EASE } from './shared'
import { PAGES, useRouter } from '../router'
import type { PageId } from '../router'
import { useAuth } from '../auth'

const NAV: PageId[] = ['features', 'solutions', 'pricing', 'customers', 'docs']

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-mint text-[#05221a]">
        <Zap size={17} strokeWidth={2.5} fill="currentColor" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-cloud">Flowline</span>
    </span>
  )
}

export default function Navbar() {
  const { page, navigate } = useRouter()
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (t: PageId) => {
    if (open) {
      setOpen(false)
      window.setTimeout(() => navigate(t), 300)
    } else navigate(t)
  }

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 2.2 }}
        className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4"
      >
        <nav
          className={cn(
            'flex w-full max-w-6xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-500 md:px-5',
            scrolled && !open
              ? 'border-line bg-slate-950/80 backdrop-blur-xl'
              : 'border-transparent bg-transparent'
          )}
        >
          <button onClick={() => go('home')} aria-label="Flowline — home" className="pl-1">
            <Logo />
          </button>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV.map((id) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  page === id ? 'text-mint' : 'text-mist hover:text-cloud'
                )}
              >
                {PAGES[id]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="group relative hidden sm:block" data-hover>
                <button className="flex items-center gap-2 rounded-lg border border-line bg-panel/60 py-1.5 pl-1.5 pr-3 transition-colors hover:border-mint/40">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-mint text-[10px] font-bold text-[#05221a]">
                    {user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                  <span className="max-w-20 truncate text-xs font-medium text-cloud">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                <div className="pointer-events-none absolute right-0 top-full w-56 translate-y-2 pt-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-xl border border-line bg-panel p-4 shadow-2xl shadow-black/50">
                    <p className="text-sm font-semibold text-cloud">{user.name}</p>
                    <p className="mt-0.5 truncate text-xs text-mist">{user.email}</p>
                    <div className="mt-4 flex flex-col gap-1.5 border-t border-line pt-3">
                      <button
                        onClick={() => go('login')}
                        className="rounded-lg bg-mint/10 px-3 py-2 text-left text-xs font-medium text-mint transition-colors hover:bg-mint hover:text-[#05221a]"
                      >
                        Open dashboard
                      </button>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 px-1 py-1.5 text-left text-xs text-mist transition-colors hover:text-cloud"
                      >
                        <LogOut size={13} /> Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => go('login')}
                className="hidden rounded-lg px-4 py-2 text-sm font-medium text-mist transition-colors hover:text-cloud sm:block"
              >
                Sign in
              </button>
            )}

            <button
              onClick={() => go('login')}
              className="hidden rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-[#05221a] transition-all duration-300 hover:shadow-[0_0_28px_-6px_rgba(78,240,176,0.6)] sm:block"
            >
              Start free
            </button>

            <button
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-cloud lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-void/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-line text-cloud"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-1 px-6">
              {(['home', ...NAV, 'login'] as PageId[]).map((id, i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, ease: EASE }}
                  onClick={() => go(id)}
                  className={cn(
                    'flex items-center justify-between border-b border-line py-4 text-left font-display text-3xl font-semibold',
                    page === id ? 'text-mint' : 'text-cloud'
                  )}
                >
                  {PAGES[id]}
                  <span className="font-mono text-xs text-mist">0{i + 1}</span>
                </motion.button>
              ))}
            </div>
            <div className="px-6 py-8">
              <button
                onClick={() => go('login')}
                className="w-full rounded-xl bg-mint py-4 text-center text-sm font-semibold text-[#05221a]"
              >
                Start free — no card required
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
