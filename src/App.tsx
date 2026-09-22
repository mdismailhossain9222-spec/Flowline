import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { EASE } from './components/shared'
import { lenisRef } from './utils/lenis'
import { RouterProvider, useRouter } from './router'
import { AuthProvider } from './auth'
import Home from './pages/Home'
import Features from './pages/Features'
import Solutions from './pages/Solutions'
import Pricing from './pages/Pricing'
import Customers from './pages/Customers'
import Docs from './pages/Docs'
import Login from './pages/Login'

function PageSwitch({ started }: { started: boolean }) {
  const { page } = useRouter()
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={page}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {page === 'home' && <Home started={started} />}
        {page === 'features' && <Features />}
        {page === 'solutions' && <Solutions />}
        {page === 'pricing' && <Pricing />}
        {page === 'customers' && <Customers />}
        {page === 'docs' && <Docs />}
        {page === 'login' && <Login />}
      </motion.main>
    </AnimatePresence>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const finish = useCallback(() => setLoading(false), [])

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenisRef.current = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [loading])

  return (
    <RouterProvider>
      <AuthProvider>
        <div className="relative min-h-screen bg-void font-sans text-cloud">
          <AnimatePresence>
            {loading && <Preloader key="preloader" onDone={finish} />}
          </AnimatePresence>

          <Cursor />
          <Navbar />
          <PageSwitch started={!loading} />
          <Footer />
        </div>
      </AuthProvider>
    </RouterProvider>
  )
}
