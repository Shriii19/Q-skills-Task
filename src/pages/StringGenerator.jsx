import { useCallback, useEffect, useState } from 'react'
import { Check, Copy, Dices, Files, History, RefreshCw } from 'lucide-react'
import clsx from 'clsx'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useLocalStorage } from '../lib/useLocalStorage'
import { useToast } from '../context/ToastContext'
import {
  buildAlphabet,
  calculateEntropyBits,
  generateRandomString,
  strengthLabel,
} from '../lib/randomString'

const CHARSET_TOGGLES = [
  { key: 'uppercase', label: 'A–Z' },
  { key: 'lowercase', label: 'a–z' },
  { key: 'numbers', label: '0–9' },
  { key: 'symbols', label: '!@#$' },
]

const DEFAULT_OPTIONS = {
  length: 16,
  quantity: 1,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
  excludeAmbiguous: true,
}

const STRENGTH_BAR = {
  weak: 'bg-red-500',
  fair: 'bg-amber-500',
  strong: 'bg-emerald-500',
  excellent: 'bg-emerald-400',
}

export default function StringGenerator() {
  useDocumentTitle('Anvil — String Generator')
  const notify = useToast()

  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [results, setResults] = useState([])
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const [history, setHistory] = useLocalStorage('anvil-string-history', [])
  const [, setStats] = useLocalStorage('anvil-stats', { translations: 0, characters: 0, strings: 0 })

  const alphabet = buildAlphabet(options)
  const entropyBits = calculateEntropyBits(options.length, alphabet.length || 1)
  const strength = strengthLabel(entropyBits)

  const handleGenerate = useCallback(() => {
    if (!alphabet) return
    const batch = Array.from({ length: options.quantity }, () =>
      generateRandomString(options.length, alphabet),
    )
    setResults(batch)
    setStats((current) => ({ ...current, strings: current.strings + batch.length }))
    setHistory((current) => [
      ...batch.map((value, index) => ({
        id: `${Date.now()}-${index}`,
        value,
        length: options.length,
        timestamp: Date.now(),
      })),
      ...current,
    ].slice(0, 8))
  }, [alphabet, options.quantity, options.length, setHistory, setStats])

  // Debounced so dragging the length slider doesn't spam history/stats.
  useEffect(() => {
    const timeout = window.setTimeout(handleGenerate, 300)
    return () => window.clearTimeout(timeout)
  }, [handleGenerate])

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        handleGenerate()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleGenerate])

  const toggleCharset = (key) => {
    setOptions((current) => {
      const nextValue = !current[key]
      const activeCount = CHARSET_TOGGLES.filter(({ key: k }) =>
        k === key ? nextValue : current[k],
      ).length
      if (!nextValue && activeCount === 0) return current
      return { ...current, [key]: nextValue }
    })
  }

  const copyOne = async (value, index) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedIndex(index)
      window.setTimeout(() => setCopiedIndex(null), 1500)
    } catch {
      notify('Could not copy — your browser blocked clipboard access', { type: 'error' })
    }
  }

  const copyAll = async () => {
    if (!results.length) return
    try {
      await navigator.clipboard.writeText(results.join('\n'))
      setCopiedAll(true)
      notify(`Copied ${results.length} string${results.length === 1 ? '' : 's'}`, { type: 'success' })
      window.setTimeout(() => setCopiedAll(false), 1500)
    } catch {
      notify('Could not copy — your browser blocked clipboard access', { type: 'error' })
    }
  }

  const copyHistoryEntry = async (value) => {
    try {
      await navigator.clipboard.writeText(value)
      notify('Copied to clipboard', { type: 'success' })
    } catch {
      notify('Could not copy — your browser blocked clipboard access', { type: 'error' })
    }
  }

  const clearHistory = () => {
    setHistory([])
    notify('Cleared string history', { type: 'info' })
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs tracking-wider text-ember-600 uppercase dark:text-ember-400">
          String Generator
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink-900 sm:text-3xl dark:text-ink-50">
          Forge a random string.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-500 dark:text-ink-400">
          Tune the options and the result updates live, drawn from{' '}
          <code className="rounded bg-ink-100 px-1 py-0.5 font-mono text-[13px] dark:bg-ink-800">
            crypto.getRandomValues
          </code>{' '}
          rather than <code className="rounded bg-ink-100 px-1 py-0.5 font-mono text-[13px] dark:bg-ink-800">Math.random</code>.
          Press <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> to reforge instantly.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-3">
          {results.length === 0 ? (
            <EmptyResult />
          ) : (
            results.map((value, index) => (
              <div
                key={`${value}-${index}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-ink-200 bg-white/70 px-4 py-3 dark:border-ink-800 dark:bg-ink-900/40"
              >
                <span className="truncate font-mono text-[15px] text-ink-800 select-all dark:text-ink-100">
                  {value}
                </span>
                <button
                  type="button"
                  onClick={() => copyOne(value, index)}
                  className="shrink-0 rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
                  aria-label="Copy string"
                >
                  {copiedIndex === index ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleGenerate}
              className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-medium text-white transition-transform hover:-translate-y-px active:translate-y-0 dark:bg-ember-500 dark:text-ink-950"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </button>
            <button
              type="button"
              onClick={copyAll}
              disabled={!results.length}
              className="flex items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2 text-xs font-medium text-ink-500 transition-colors hover:border-ember-500/40 hover:text-ember-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-ink-800 dark:text-ink-400"
            >
              {copiedAll ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Files className="h-3.5 w-3.5" />}
              Copy all
            </button>
          </div>
        </div>

        <div className="space-y-5 rounded-2xl border border-ink-200 bg-white/70 p-5 dark:border-ink-800 dark:bg-ink-900/40">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink-500 dark:text-ink-400">
              <span>Length</span>
              <span className="font-mono text-ink-800 dark:text-ink-100">{options.length}</span>
            </div>
            <input
              type="range"
              min={4}
              max={64}
              value={options.length}
              onChange={(event) =>
                setOptions((current) => ({ ...current, length: Number(event.target.value) }))
              }
              className="w-full accent-ember-500"
            />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-ink-500 dark:text-ink-400">Characters</p>
            <div className="grid grid-cols-2 gap-1.5">
              {CHARSET_TOGGLES.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleCharset(key)}
                  className={clsx(
                    'rounded-lg border px-2 py-1.5 font-mono text-xs transition-colors',
                    options[key]
                      ? 'border-ember-500/50 bg-ember-500/10 text-ember-600 dark:text-ember-400'
                      : 'border-ink-200 text-ink-400 hover:border-ink-300 dark:border-ink-800',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-center justify-between text-xs font-medium text-ink-500 dark:text-ink-400">
            Avoid ambiguous (l, 1, I, O, 0)
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={(event) =>
                setOptions((current) => ({ ...current, excludeAmbiguous: event.target.checked }))
              }
              className="h-4 w-4 accent-ember-500"
            />
          </label>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink-500 dark:text-ink-400">
              <span>Quantity</span>
              <span className="font-mono text-ink-800 dark:text-ink-100">{options.quantity}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={options.quantity}
              onChange={(event) =>
                setOptions((current) => ({ ...current, quantity: Number(event.target.value) }))
              }
              className="w-full accent-ember-500"
            />
          </div>

          <div className="border-t border-ink-100 pt-4 dark:border-ink-800">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-ink-500 dark:text-ink-400">Strength</span>
              <span className="font-mono text-ink-800 dark:text-ink-100">{entropyBits} bits</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
              <div
                className={clsx('h-full rounded-full transition-all', STRENGTH_BAR[strength.tone])}
                style={{ width: `${Math.min(100, (entropyBits / 128) * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-ink-400">{strength.label}</p>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="border-t border-ink-200 pt-6 dark:border-ink-800">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-ink-700 dark:text-ink-200">
              <History className="h-4 w-4" /> Recent
            </h2>
            <button type="button" onClick={clearHistory} className="text-xs text-ink-400 hover:text-ember-600">
              Clear
            </button>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {history.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => copyHistoryEntry(entry.value)}
                  className="rounded-lg border border-ink-200 bg-white/70 px-2.5 py-1.5 font-mono text-xs text-ink-600 transition-colors hover:border-ember-500/40 hover:text-ember-600 dark:border-ink-800 dark:bg-ink-900/40 dark:text-ink-300"
                  title="Click to copy"
                >
                  {entry.value}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function EmptyResult() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-300 py-10 text-center dark:border-ink-700">
      <Dices className="h-6 w-6 text-ink-300 dark:text-ink-600" />
      <p className="text-sm text-ink-400">Select at least one character set to forge a string.</p>
    </div>
  )
}

function Kbd({ children }) {
  return (
    <kbd className="rounded border border-ink-300 bg-ink-100 px-1.5 py-0.5 font-mono text-[11px] dark:border-ink-700 dark:bg-ink-800">
      {children}
    </kbd>
  )
}
