import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Command, Keyboard } from 'lucide-react'
import clsx from 'clsx'

const SHORTCUTS = [
  {
    category: 'Navigation',
    items: [
      { keys: ['Cmd', 'K'], description: 'Open command palette', mac: true },
      { keys: ['Ctrl', 'K'], description: 'Open command palette', windows: true },
      { keys: ['/', '?'], description: 'Show shortcuts' },
      { keys: ['Esc'], description: 'Close modal/dialog' },
    ],
  },
  {
    category: 'Translator',
    items: [
      { keys: ['Cmd', 'Enter'], description: 'Translate text', mac: true },
      { keys: ['Ctrl', 'Enter'], description: 'Translate text', windows: true },
      { keys: ['Alt', 'S'], description: 'Swap languages' },
      { keys: ['Alt', 'C'], description: 'Copy translation' },
      { keys: ['Alt', 'R'], description: 'Read aloud' },
    ],
  },
  {
    category: 'String Generator',
    items: [
      { keys: ['Cmd', 'Enter'], description: 'Generate new string', mac: true },
      { keys: ['Ctrl', 'Enter'], description: 'Generate new string', windows: true },
      { keys: ['Alt', 'C'], description: 'Copy result' },
      { keys: ['Alt', 'R'], description: 'Regenerate' },
    ],
  },
  {
    category: 'General',
    items: [
      { keys: ['Cmd', 'D'], description: 'Toggle dark mode', mac: true },
      { keys: ['Ctrl', 'D'], description: 'Toggle dark mode', windows: true },
    ],
  },
]

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-2xl dark:border-ink-800 dark:bg-ink-900"
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4 dark:border-ink-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-ember-500 to-ember-600 text-white shadow-lg">
                  <Keyboard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-ink-900 dark:text-ink-50">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-xs text-ink-500 dark:text-ink-400">
                    Speed up your workflow
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 max-h-[calc(85vh-80px)]">
              <div className="space-y-6">
                {SHORTCUTS.map((section) => (
                  <div key={section.category}>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ember-600 dark:text-ember-400">
                      {section.category}
                    </h3>
                    <div className="space-y-2">
                      {section.items
                        .filter((item) => !item.mac || (item.mac && isMac))
                        .filter((item) => !item.windows || (item.windows && !isMac))
                        .map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-lg border border-ink-100 bg-ink-50/50 px-4 py-3 dark:border-ink-800 dark:bg-ink-900/30"
                          >
                            <span className="text-sm text-ink-700 dark:text-ink-300">
                              {item.description}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {item.keys.map((key, keyIdx) => (
                                <div key={keyIdx} className="flex items-center gap-1">
                                  <kbd
                                    className={clsx(
                                      'inline-flex min-w-[28px] items-center justify-center rounded-md border border-ink-300 bg-white px-2 py-1 font-mono text-xs font-medium text-ink-700 shadow-sm dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300',
                                    )}
                                  >
                                    {key === 'Cmd' && isMac ? '⌘' : key}
                                  </kbd>
                                  {keyIdx < item.keys.length - 1 && (
                                    <span className="text-xs text-ink-400 dark:text-ink-500">
                                      +
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
                <div className="flex gap-3">
                  <Command className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Pro Tip
                    </p>
                    <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                      Press <kbd className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[11px] dark:bg-blue-900">?</kbd> anywhere to quickly
                      view these shortcuts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
