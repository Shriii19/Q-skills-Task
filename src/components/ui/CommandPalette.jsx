import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ArrowRight,
  Dices,
  Languages,
  LayoutGrid,
  Moon,
  Sun,
  History,
  Keyboard,
  Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { useTheme } from '../../lib/useTheme'

const COMMANDS = [
  {
    id: 'nav-home',
    label: 'Go to Overview',
    icon: LayoutGrid,
    action: 'navigate',
    path: '/',
    keywords: ['home', 'overview', 'dashboard'],
  },
  {
    id: 'nav-translator',
    label: 'Go to Translator',
    icon: Languages,
    action: 'navigate',
    path: '/translator',
    keywords: ['translate', 'language', 'text'],
  },
  {
    id: 'nav-generator',
    label: 'Go to String Generator',
    icon: Dices,
    action: 'navigate',
    path: '/string-generator',
    keywords: ['random', 'password', 'string', 'generate', 'token'],
  },
  {
    id: 'toggle-theme',
    label: 'Toggle Dark Mode',
    icon: Moon,
    iconAlt: Sun,
    action: 'toggleTheme',
    keywords: ['dark', 'light', 'theme', 'mode'],
  },
  {
    id: 'show-shortcuts',
    label: 'Show Keyboard Shortcuts',
    icon: Keyboard,
    action: 'showShortcuts',
    keywords: ['shortcuts', 'hotkeys', 'keys', 'help'],
  },
]

export default function CommandPalette({ isOpen, onClose, onShowShortcuts }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const filteredCommands = useMemo(() => {
    if (!search.trim()) return COMMANDS

    const query = search.toLowerCase()
    return COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(query) ||
        cmd.keywords?.some((kw) => kw.includes(query)),
    )
  }, [search])

  useEffect(() => {
    setSelected(0)
  }, [search])

  useEffect(() => {
    if (!isOpen) {
      setSearch('')
      setSelected(0)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelected((prev) => (prev + 1) % filteredCommands.length)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelected((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
      } else if (event.key === 'Enter' && filteredCommands[selected]) {
        event.preventDefault()
        executeCommand(filteredCommands[selected])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selected, filteredCommands, onClose])

  function executeCommand(command) {
    if (command.action === 'navigate') {
      navigate(command.path)
    } else if (command.action === 'toggleTheme') {
      toggleTheme()
    } else if (command.action === 'showShortcuts') {
      onShowShortcuts()
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-2xl dark:border-ink-800 dark:bg-ink-900"
          >
            <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-3 dark:border-ink-800">
              <Search className="h-5 w-5 text-ink-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search commands..."
                className="flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none dark:text-ink-50"
                autoFocus
              />
              <kbd className="hidden rounded bg-ink-100 px-2 py-1 font-mono text-xs text-ink-500 dark:bg-ink-800 dark:text-ink-400 sm:block">
                ESC
              </kbd>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center">
                  <Zap className="mx-auto h-8 w-8 text-ink-300 dark:text-ink-700" />
                  <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
                    No commands found
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCommands.map((command, idx) => {
                    const Icon = command.icon
                    const IconAlt = command.iconAlt
                    const isSelected = idx === selected
                    const displayIcon =
                      IconAlt && theme === 'dark' && command.action === 'toggleTheme'
                        ? IconAlt
                        : Icon

                    return (
                      <button
                        key={command.id}
                        onClick={() => executeCommand(command)}
                        onMouseEnter={() => setSelected(idx)}
                        className={clsx(
                          'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors',
                          isSelected
                            ? 'bg-ember-500/10 text-ember-700 dark:bg-ember-500/20 dark:text-ember-300'
                            : 'text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800/50',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={clsx(
                              'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                              isSelected
                                ? 'bg-ember-500/15 text-ember-600 dark:bg-ember-500/25 dark:text-ember-400'
                                : 'bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400',
                            )}
                          >
                            <displayIcon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">{command.label}</span>
                        </div>
                        <ArrowRight
                          className={clsx(
                            'h-4 w-4 transition-all',
                            isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1',
                          )}
                        />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-ink-100 px-4 py-2 dark:border-ink-800">
              <div className="flex items-center justify-between text-xs text-ink-400 dark:text-ink-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded bg-ink-100 px-1.5 py-0.5 font-mono dark:bg-ink-800">
                      ↑
                    </kbd>
                    <kbd className="rounded bg-ink-100 px-1.5 py-0.5 font-mono dark:bg-ink-800">
                      ↓
                    </kbd>
                    <span>navigate</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded bg-ink-100 px-1.5 py-0.5 font-mono dark:bg-ink-800">
                      ⏎
                    </kbd>
                    <span>select</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
