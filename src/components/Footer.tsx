import { Zap } from 'lucide-react'
import { Reveal } from './shared'
import { useRouter } from '../router'
import type { PageId } from '../router'

const COLS: { title: string; links: { label: string; page?: PageId }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', page: 'home' },
      { label: 'Features', page: 'features' },
      { label: 'Solutions', page: 'solutions' },
      { label: 'Pricing', page: 'pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Customers', page: 'customers' },
      { label: 'Documentation', page: 'docs' },
      { label: 'Careers' },
      { label: 'Blog' },
    ],
  },
  {
    title: 'Resources',
    links: [{ label: 'Changelog' }, { label: 'API Reference', page: 'docs' }, { label: 'Status' }, { label: 'Community' }],
  },
  {
    title: 'Legal',
    links: [{ label: 'Privacy' }, { label: 'Terms' }, { label: 'Security' }, { label: 'DPA' }],
  },
]

export default function Footer() {
  const { navigate } = useRouter()
  return (
    <footer className="relative z-10 border-t border-line bg-slate-950 px-6 pt-20 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <span className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-mint text-[#05221a]">
                  <Zap size={17} strokeWidth={2.5} fill="currentColor" />
                </span>
                <span className="font-display text-lg font-bold text-cloud">Flowline</span>
              </span>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist">
                The automation platform for modern teams. Build workflows visually, connect
                every tool, and ship faster.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3 py-1.5 text-xs text-mist">
                <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-dot" />
                All systems operational
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-4">
            {COLS.map((col, ci) => (
              <Reveal key={col.title} delay={ci * 0.06}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-cloud">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <button
                        onClick={() => l.page && navigate(l.page)}
                        className="text-sm text-mist transition-colors hover:text-mint"
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        {/* big wordmark */}
        <div className="mt-16 overflow-hidden border-t border-line pt-10">
          <button
            onClick={() => navigate('home')}
            className="block w-full select-none text-left font-display text-[clamp(3rem,15vw,12rem)] font-bold leading-none tracking-[-0.04em] text-transparent"
            style={{ WebkitTextStroke: '1px #1e2636' }}
            aria-label="Flowline"
          >
            Flowline
          </button>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-line py-7 text-xs text-mist md:flex-row md:items-center">
          <span>© 2026 Flowline, Inc. — SOC 2 Type II · GDPR</span>
          <span className="font-mono text-mist/70">v4.2.0 — built for teams that move</span>
        </div>
      </div>
    </footer>
  )
}
