import { Link } from 'react-router-dom'
import { ArrowLeft, Hammer } from 'lucide-react'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Anvil — Page not found')

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500">
        <Hammer className="h-5 w-5" />
      </span>
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
          Nothing on this shelf.
        </h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
          That page doesn't exist here — maybe it was never forged.
        </p>
      </div>
      <Link
        to="/"
        className="mt-2 flex items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2 text-xs font-medium text-ink-600 transition-colors hover:border-ember-500/40 hover:text-ember-600 dark:border-ink-800 dark:text-ink-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to overview
      </Link>
    </div>
  )
}
