import { useEffect, useState } from 'react'
import { NavLink, useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Dices, Hammer, Languages, LayoutGrid, Menu, Moon, Sun, X } from 'lucide-react'
import clsx from 'clsx'
import { useTheme } from '../../context/ThemeContext'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/translator', label: 'Translator', icon: Languages },
  { to: '/string-generator', label: 'String Generator', icon: Dices },
]

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const outlet = useOutlet()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <div className="min-h-dvh dark:bg-ink-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-ink-200 bg-white/60 backdrop-blur-sm md:flex dark:border-ink-800 dark:bg-ink-900/40">
        <div className="px-5 pt-6 pb-2">
          <BrandMark />
        </div>
        <NavItems />
        <Footer theme={theme} toggleTheme={toggleTheme} />
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-200 bg-ink-50/80 px-4 py-3 backdrop-blur-sm md:hidden dark:border-ink-800 dark:bg-ink-950/80">
        <BrandMark />
        <div className="flex items-center gap-1">
          <ThemeButton theme={theme} toggleTheme={toggleTheme} />
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink-950/40 backdrop-blur-[2px]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col bg-ink-50 shadow-xl dark:bg-ink-950"
            >
              <div className="flex items-center justify-between px-4 pt-5">
                <BrandMark />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4">
                <NavItems />
              </div>
              <Footer theme={theme} toggleTheme={toggleTheme} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="md:pl-60">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

function NavItems() {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            clsx(
              'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-ember-500/10 text-ember-600 dark:text-ember-400'
                : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800/60 dark:hover:text-ink-100',
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink-900 font-display text-sm font-bold text-ember-400 dark:bg-ember-500 dark:text-ink-950">
        A
      </span>
      <span className="font-display text-[15px] font-semibold text-ink-900 dark:text-ink-50">
        Anvil
      </span>
    </div>
  )
}

function ThemeButton({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

function Footer({ theme, toggleTheme }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-ink-200 px-5 py-4 dark:border-ink-800">
      <p className="flex items-center gap-1.5 text-xs text-ink-400">
        <Hammer className="h-3.5 w-3.5" />
        Runs in your browser
      </p>
      <ThemeButton theme={theme} toggleTheme={toggleTheme} />
    </div>
  )
}
