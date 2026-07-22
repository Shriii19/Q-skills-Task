import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function StatsCard({ icon: Icon, label, value, trend, color = 'ember' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'relative overflow-hidden rounded-xl border p-4',
        'bg-gradient-to-br',
        color === 'ember' &&
          'from-ember-50 to-white border-ember-200 dark:from-ember-950/20 dark:to-ink-900/50 dark:border-ember-900/30',
        color === 'blue' &&
          'from-blue-50 to-white border-blue-200 dark:from-blue-950/20 dark:to-ink-900/50 dark:border-blue-900/30',
        color === 'green' &&
          'from-emerald-50 to-white border-emerald-200 dark:from-emerald-950/20 dark:to-ink-900/50 dark:border-emerald-900/30',
        color === 'purple' &&
          'from-purple-50 to-white border-purple-200 dark:from-purple-950/20 dark:to-ink-900/50 dark:border-purple-900/30',
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-500 dark:text-ink-400">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-ink-900 dark:text-ink-50">
            {value.toLocaleString()}
          </p>
          {trend && (
            <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{trend}</p>
          )}
        </div>
        <div
          className={clsx(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            color === 'ember' && 'bg-ember-500/10 text-ember-600 dark:bg-ember-500/20 dark:text-ember-400',
            color === 'blue' && 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
            color === 'green' && 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
            color === 'purple' && 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div
        className={clsx(
          'absolute -right-4 -bottom-4 h-20 w-20 rounded-full opacity-10 blur-2xl',
          color === 'ember' && 'bg-ember-500',
          color === 'blue' && 'bg-blue-500',
          color === 'green' && 'bg-emerald-500',
          color === 'purple' && 'bg-purple-500',
        )}
      />
    </motion.div>
  )
}
