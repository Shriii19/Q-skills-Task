import { Link } from 'react-router-dom'
import { ArrowLeft, Hammer } from 'lucide-react'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Anvil — Page not found')

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-ink-100 to-ink-200 text-ink-400 shadow-inner dark:from-ink-800 dark:to-ink-900 dark:text-ink-500">
        <Hammer className="h-6 w-6" />
      </span>
      <div>
        <p className="font-mono text-xs tracking-wider text-ember-600 uppercase dark:text-ember-400">
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
          Nothing on this shelf.
        </h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
          That page doesn't exist here — maybe it was never forged.
        </p>
      </div>
      <Link
        to="/"
        className="flex items-center gap-1.5 rounded-full border border-ink-200 bg-white/80 px-5 py-2 text-xs font-medium text-ink-600 shadow-sm transition-all hover:-translate-y-px hover:border-ember-500/40 hover:text-ember-600 hover:shadow dark:border-ink-800 dark:bg-ink-900/40 dark:text-ink-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to overview
      </Link>
    </div>
  )
}
