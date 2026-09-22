import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity, AlertTriangle, Check, Eye, EyeOff, Lock, Mail, Loader2,
  Play, Plus, ShieldCheck, User as UserIcon, Workflow, Zap,
} from 'lucide-react'
import { AuthError, DEMO_EMAIL, DEMO_PASSWORD, useAuth } from '../auth'
import { Button, Counter, EASE, Kicker, Panel } from '../components/shared'
import FlowScene from '../components/three/FlowScene'
import { cn } from '../utils/cn'

const field =
  'w-full rounded-xl border border-line bg-slate-950 py-3 pl-10 pr-3 text-sm text-cloud outline-none transition-colors placeholder:text-mist focus:border-mint/50'
const lbl = 'mb-1.5 block text-xs font-medium text-mist'

const FLOWS = [
  ['Lead router', 'active', '2,481', '99.8%'],
  ['Nightly finance close', 'active', '31', '100%'],
  ['Incident triage', 'active', '148', '98.6%'],
  ['Churn signal watcher', 'paused', '0', '—'],
  ['Onboarding sequence', 'active', '512', '99.2%'],
]

function strength(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export default function Login() {
  const { user, login, register, logout, backend } = useAuth()
  const [mode, setMode] = useState<'signin' | 'join'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<{ msg: string; retry?: number } | null>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!err?.retry) return
    setCount(err.retry)
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          window.clearInterval(id)
          setErr(null)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [err])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    setBusy(true)
    try {
      if (mode === 'signin') await login(email, pw)
      else await register(name, email, pw)
    } catch (e2) {
      if (e2 instanceof AuthError) setErr({ msg: e2.message, retry: e2.retryAfter })
      else setErr({ msg: 'Something went wrong. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  /* ---------------- dashboard (signed in) ---------------- */
  if (user) {
    return (
      <section className="relative z-10 min-h-screen px-6 pb-24 pt-32 md:px-10 md:pt-40">
        <div className="grid-fade absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Kicker>Dashboard</Kicker>
              <h1 className="mt-4 font-display text-4xl font-semibold text-cloud md:text-5xl">
                Welcome back, <span className="text-mint">{user.name.split(' ')[0]}</span>
              </h1>
              <p className="mt-2 text-sm text-mist">{user.email}</p>
            </div>
            <div className="flex gap-3">
              <Button label="New workflow" onClick={() => undefined} />
              <button
                onClick={logout}
                className="rounded-xl border border-line px-5 py-3 text-sm font-medium text-mist transition-colors hover:border-mint/40 hover:text-cloud"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* stat cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Workflow, label: 'Active workflows', value: 4, suffix: '' },
              { icon: Play, label: 'Runs today', value: 3172, suffix: '' },
              { icon: Activity, label: 'Success rate', value: 99, suffix: '.4%' },
              { icon: Zap, label: 'Hours saved / wk', value: 46, suffix: '' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
              >
                <Panel className="p-5">
                  <s.icon size={18} className="text-mint" />
                  <p className="mt-4 font-display text-3xl font-bold text-cloud">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-xs text-mist">{s.label}</p>
                </Panel>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {/* workflow table */}
            <Panel className="lg:col-span-2">
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <h2 className="font-display text-lg font-semibold text-cloud">Your workflows</h2>
                <button className="flex items-center gap-1.5 text-xs font-medium text-mint" data-hover>
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="divide-y divide-line">
                {FLOWS.map(([nameF, status, runs, rate], i) => (
                  <motion.div
                    key={nameF}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                    className="grid grid-cols-12 items-center gap-3 px-6 py-4"
                    data-hover
                  >
                    <span className="col-span-6 flex items-center gap-3 md:col-span-5">
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          status === 'active' ? 'bg-mint animate-pulse-dot' : 'bg-mist/50'
                        )}
                      />
                      <span className="truncate text-sm font-medium text-cloud">{nameF}</span>
                    </span>
                    <span className="col-span-3 text-xs text-mist md:col-span-3">
                      <span className={cn(status === 'active' ? 'text-mint' : 'text-mist')}>{status}</span>
                    </span>
                    <span className="col-span-2 text-right font-mono text-xs text-cloud md:col-span-2">{runs}</span>
                    <span className="col-span-1 text-right font-mono text-xs text-mist md:col-span-2">{rate}</span>
                  </motion.div>
                ))}
              </div>
            </Panel>

            {/* security note */}
            <Panel className="flex flex-col p-6">
              <ShieldCheck size={22} className="text-mint" />
              <h3 className="mt-4 font-display text-lg font-semibold text-cloud">Session secured</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">
                You&apos;re signed in over an encrypted session that expires after 12 hours.
                Workflow data is never served to unauthenticated requests, and every action
                is written to an immutable audit log.
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {['SOC 2', 'SAML SSO', 'Audit logs', 'AES-256'].map((b) => (
                  <span key={b} className="rounded-full border border-line px-3 py-1 text-[11px] text-mist">
                    {b}
                  </span>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </section>
    )
  }

  /* ---------------- auth gate (signed out) ---------------- */
  const s = strength(pw)
  return (
    <section className="relative z-10 min-h-screen px-6 pb-20 pt-28 md:px-10 md:pt-32">
      <div className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* left — visual */}
        <div className="relative hidden overflow-hidden rounded-3xl border border-line lg:block">
          <FlowScene className="h-[560px] w-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <span className="flex items-center gap-2 text-xs text-mint">
              <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-dot" /> 14M workflows running now
            </span>
            <p className="mt-3 font-display text-2xl font-semibold text-cloud">
              Your team&apos;s busywork, on autopilot.
            </p>
          </div>
        </div>

        {/* right — form */}
        <div>
          <Kicker>{mode === 'signin' ? 'Welcome back' : 'Get started free'}</Kicker>
          <h1 className="mt-5 font-display text-4xl font-semibold text-cloud md:text-5xl">
            {mode === 'signin' ? 'Sign in to Flowline' : 'Create your workspace'}
          </h1>

          <Panel className="mt-8 p-7 md:p-8">
            <div className="mb-7 grid grid-cols-2 gap-1 rounded-xl border border-line bg-slate-950 p-1">
              {(['signin', 'join'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setErr(null) }}
                  className={cn(
                    'relative rounded-lg py-2 text-sm font-medium transition-colors',
                    mode === m ? 'text-[#05221a]' : 'text-mist hover:text-cloud'
                  )}
                >
                  {mode === m && (
                    <motion.span layoutId="auth-tab" className="absolute inset-0 rounded-lg bg-mint" transition={{ duration: 0.35, ease: EASE }} />
                  )}
                  <span className="relative">{m === 'signin' ? 'Sign in' : 'Sign up'}</span>
                </button>
              ))}
            </div>

            <form onSubmit={submit} noValidate className="space-y-5">
              <AnimatePresence initial={false}>
                {mode === 'join' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <label htmlFor="l-name" className={lbl}>Name</label>
                    <div className="relative">
                      <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
                      <input id="l-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Sam Rivera" className={field} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label htmlFor="l-email" className={lbl}>Work email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
                  <input id="l-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@company.com" className={field} required />
                </div>
              </div>

              <div>
                <label htmlFor="l-pw" className={lbl}>Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
                  <input
                    id="l-pw"
                    type={show ? 'text' : 'password'}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    placeholder="••••••••"
                    minLength={8}
                    className={cn(field, 'pr-10')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-mist transition-colors hover:text-mint"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {mode === 'join' && pw.length > 0 && (
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4].map((b) => (
                        <span key={b} className={cn('h-1 flex-1 rounded-full transition-colors duration-500', s >= b ? 'bg-mint' : 'bg-line')} />
                      ))}
                    </div>
                    <span className="text-[11px] text-mist">{['Weak', 'Fair', 'Good', 'Strong', 'Great'][s]}</span>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {err && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-[#ff6b6b]/40 bg-[#ff6b6b]/10 px-4 py-3 text-xs text-[#ff9b9b]">
                      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                      <span>
                        {err.msg}
                        {count > 0 && <span className="ml-1 font-medium tabular-nums">Retry in {count}s.</span>}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={busy || count > 0}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-mint py-3.5 text-sm font-semibold text-[#05221a] transition-all duration-300 hover:shadow-[0_0_30px_-6px_rgba(78,240,176,0.6)] disabled:opacity-60"
              >
                {busy && <Loader2 size={15} className="animate-spin" />}
                {busy ? 'Checking…' : count > 0 ? `Locked · ${count}s` : mode === 'signin' ? 'Sign in' : 'Create workspace'}
              </button>

              <p className="flex items-start gap-2 text-xs leading-relaxed text-mist">
                <Check size={13} className="mt-0.5 shrink-0 text-mint" />
                {backend ? (
                  <>Secured with httpOnly sessions, rotating tokens and rate limiting.</>
                ) : (
                  <>
                    Demo — sign in with <span className="text-cloud">{DEMO_EMAIL}</span> /{' '}
                    <span className="text-cloud">{DEMO_PASSWORD}</span>. Passwords are hashed; five
                    failed tries locks the form.
                  </>
                )}
              </p>
            </form>
          </Panel>
        </div>
      </div>
    </section>
  )
}
