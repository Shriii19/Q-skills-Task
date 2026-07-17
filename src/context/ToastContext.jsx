import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import clsx from 'clsx'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback(
    (message, { type = 'info', duration = 3200 } = {}) => {
      const id = ++idRef.current
      setToasts((current) => [...current, { id, message, type }])
      window.setTimeout(() => dismiss(id), duration)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type] ?? Info
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                role="status"
                className={clsx(
                  'pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 shadow-lg shadow-ink-950/5 backdrop-blur-sm',
                  'bg-white/95 dark:bg-ink-900/95',
                  toast.type === 'success' && 'border-emerald-500/30',
                  toast.type === 'error' && 'border-red-500/30',
                  toast.type === 'info' && 'border-ink-200 dark:border-ink-700',
                )}
              >
                <Icon
                  className={clsx(
                    'mt-0.5 h-4 w-4 shrink-0',
                    toast.type === 'success' && 'text-emerald-500',
                    toast.type === 'error' && 'text-red-500',
                    toast.type === 'info' && 'text-ember-500',
                  )}
                />
                <p className="flex-1 text-sm text-ink-700 dark:text-ink-200">{toast.message}</p>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="text-ink-400 transition-colors hover:text-ink-600 dark:hover:text-ink-200"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
