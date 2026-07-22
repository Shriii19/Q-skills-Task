import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Command, ArrowUp } from 'lucide-react'
import clsx from 'clsx'

export default function FloatingActionButton({ onCommandPalette }) {
  const [visible, setVisible] = useState(false)
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    function handleScroll() {
      const scrolled = window.scrollY > 300
      setVisible(scrolled)

      const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100
      setAtBottom(bottom)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 md:bottom-8 md:right-8"
        >
          <motion.button
            onClick={onCommandPalette}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-ember-500 to-ember-600 text-white shadow-lg shadow-ember-500/30 transition-shadow hover:shadow-xl hover:shadow-ember-500/40 dark:shadow-ember-500/20 dark:hover:shadow-ember-500/30"
            aria-label="Open command palette"
            title="Command Palette (⌘K)"
          >
            <Command className="h-5 w-5" />
            <span className="absolute inset-0 rounded-full ring-2 ring-inset ring-white/20" />
            <motion.span
              className="absolute inset-0 rounded-full bg-white"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>

          {atBottom && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              onClick={scrollToTop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-200 bg-white/90 text-ink-600 shadow-lg backdrop-blur-sm transition-colors hover:bg-ink-50 hover:text-ink-900 dark:border-ink-700 dark:bg-ink-800/90 dark:text-ink-300 dark:hover:bg-ink-700 dark:hover:text-ink-100"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
