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
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-ink-200 bg-white/70 backdrop-blur-md md:flex dark:border-ink-800 dark:bg-ink-900/50">
        <div className="px-5 pt-6 pb-4">
          <BrandMark />
        </div>
        <div className="mx-3 mb-4 h-px bg-linear-to-r from-transparent via-ink-200 to-transparent dark:via-ink-800" />
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
    <nav className="flex flex-1 flex-col gap-0.5 px-3">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            clsx(
              'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-linear-to-r from-ember-500/15 to-ember-500/5 text-ember-600 shadow-sm dark:from-ember-500/20 dark:to-ember-500/5 dark:text-ember-400'
                : 'text-ink-500 hover:bg-ink-100/80 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800/50 dark:hover:text-ink-100',
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-ember-500" />
              )}
              <Icon
                className={clsx(
                  'h-4 w-4 shrink-0 transition-transform duration-150',
                  'group-hover:scale-110',
                )}
                strokeWidth={isActive ? 2.25 : 2}
              />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-ink-800 to-ink-950 font-display text-sm font-bold text-ember-400 shadow-md shadow-ink-950/20 dark:from-ember-500 dark:to-ember-600 dark:text-ink-950">
        A
        <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
      </span>
      <div className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-semibold text-ink-900 dark:text-ink-50">
          Anvil
        </span>
        <span className="mt-0.5 text-[10px] font-medium tracking-wider text-ink-400 uppercase dark:text-ink-600">
          Text Workshop
        </span>
      </div>
    </div>
  )
}

function ThemeButton({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 text-ink-500 transition-all hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

function Footer({ theme, toggleTheme }) {
  return (
    <div className="mt-auto border-t border-ink-200 px-4 py-4 dark:border-ink-800">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs text-ink-400 dark:text-ink-600">
          <Hammer className="h-3.5 w-3.5" />
          Runs in your browser
        </p>
        <ThemeButton theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
  )
}
