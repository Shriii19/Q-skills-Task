import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeftRight,
  Check,
  Copy,
  History,
  Loader2,
  Star,
  Volume2,
} from 'lucide-react'
import clsx from 'clsx'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useLocalStorage } from '../lib/useLocalStorage'
import { useToast } from '../context/ToastContext'
import { hasRapidApiKey, translateText, TranslationError } from '../lib/translateApi'
import { LANGUAGES, SOURCE_LANGUAGES, languageName } from '../data/languages'

const MAX_LENGTH = 2000
const DEBOUNCE_MS = 650
const DEFAULT_FAVORITES = ['es', 'fr', 'hi', 'ja']

function guessDefaultTarget() {
  const browserLang = navigator.language?.slice(0, 2)
  if (browserLang && browserLang !== 'en' && LANGUAGES.some((lang) => lang.code === browserLang)) {
    return browserLang
  }
  return 'es'
}

export default function Translator() {
  useDocumentTitle('Anvil — Translator')
  const notify = useToast()
  const apiKeyMissing = !hasRapidApiKey()

  const [sourceText, setSourceText] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState(guessDefaultTarget)
  const [detectedLang, setDetectedLang] = useState(null)
  const [result, setResult] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const [favorites, setFavorites] = useLocalStorage('anvil-fav-languages', DEFAULT_FAVORITES)
  const [history, setHistory] = useLocalStorage('anvil-translation-history', [])
  const [, setStats] = useLocalStorage('anvil-stats', { translations: 0, characters: 0, strings: 0 })

  const abortRef = useRef(null)
  const debounceRef = useRef(null)

  const runTranslation = useCallback(
    async (text, source, target) => {
      if (!text.trim()) {
        setResult('')
        setStatus('idle')
        setError(null)
        setDetectedLang(null)
        return
      }

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setStatus('loading')
      setError(null)

      try {
        const { translatedText, detectedSource } = await translateText({
          text,
          source,
          target,
          signal: controller.signal,
        })
        setResult(translatedText)
        setDetectedLang(source === 'auto' && detectedSource !== 'auto' ? detectedSource : null)
        setStatus('success')

        setStats((current) => ({
          ...current,
          translations: current.translations + 1,
          characters: current.characters + text.length,
        }))
        setHistory((current) => [
          {
            id: `${Date.now()}`,
            sourceText: text,
            translatedText,
            sourceLang: source,
            targetLang: target,
            timestamp: Date.now(),
          },
          ...current,
        ].slice(0, 8))
      } catch (err) {
        if (err?.name === 'AbortError') return
        setStatus('error')
        setError(
          err instanceof TranslationError
            ? err
            : new TranslationError('Something went wrong while translating.', 'unknown'),
        )
      }
    },
    [setHistory, setStats],
  )

  useEffect(() => {
    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      runTranslation(sourceText, sourceLang, targetLang)
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(debounceRef.current)
  }, [sourceText, sourceLang, targetLang, runTranslation])

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        window.clearTimeout(debounceRef.current)
        runTranslation(sourceText, sourceLang, targetLang)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [runTranslation, sourceText, sourceLang, targetLang])

  const handleSwap = () => {
    if (sourceLang === 'auto') return
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(result)
    setResult(sourceText)
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      notify('Copied translation to clipboard', { type: 'success' })
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      notify('Could not copy — your browser blocked clipboard access', { type: 'error' })
    }
  }

  const speak = (text, lang) => {
    if (!('speechSynthesis' in window) || !text) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    if (lang && lang !== 'auto') utterance.lang = lang
    window.speechSynthesis.speak(utterance)
  }

  const toggleFavorite = (code) => {
    setFavorites((current) =>
      current.includes(code) ? current.filter((c) => c !== code) : [code, ...current].slice(0, 6),
    )
  }

  const restoreHistoryEntry = (entry) => {
    setSourceLang(entry.sourceLang)
    setTargetLang(entry.targetLang)
    setSourceText(entry.sourceText)
    setResult(entry.translatedText)
    setStatus('success')
  }

  const clearHistory = () => {
    setHistory([])
    notify('Cleared translation history', { type: 'info' })
  }

  const charCount = sourceText.length
  const overLimit = charCount > MAX_LENGTH

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs tracking-wider text-ember-600 uppercase dark:text-ember-400">
          Translator
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          <span className="text-gradient bg-linear-to-r from-ink-900 to-ink-700 dark:from-ink-50 dark:to-ink-200">
            Say it in another language.
          </span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-500 dark:text-ink-400">
          Type or paste a passage below — translation starts automatically, or press{' '}
          <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> to translate immediately.
        </p>
      </header>

      {apiKeyMissing && <MissingKeyNotice />}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <LanguageSelect label="From" value={sourceLang} onChange={setSourceLang} options={SOURCE_LANGUAGES} />
            {detectedLang && (
              <span className="font-mono text-xs text-ink-400">detected: {languageName(detectedLang)}</span>
            )}
          </div>
          <div className="relative">
            <textarea
              value={sourceText}
              onChange={(event) => setSourceText(event.target.value)}
              placeholder="Start typing…"
              rows={8}
              aria-label="Text to translate"
              className="w-full resize-none rounded-2xl border border-ink-200 bg-white/80 p-4 pb-10 text-[15px] text-ink-800 placeholder:text-ink-300 shadow-sm transition-shadow focus:border-ember-500/50 focus:shadow-md focus:ring-2 focus:ring-ember-500/20 focus:outline-none dark:border-ink-800 dark:bg-ink-900/50 dark:text-ink-100 dark:placeholder:text-ink-600"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => speak(sourceText, sourceLang)}
                disabled={!sourceText}
                className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 disabled:opacity-30 dark:hover:bg-ink-800"
                aria-label="Read source text aloud"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <span className={clsx('font-mono text-xs', overLimit ? 'text-red-500' : 'text-ink-300 dark:text-ink-600')}>
                {charCount}/{MAX_LENGTH}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <LanguageSelect label="To" value={targetLang} onChange={setTargetLang} options={LANGUAGES} />
            <button
              type="button"
              onClick={() => toggleFavorite(targetLang)}
              className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
              aria-label={favorites.includes(targetLang) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={clsx('h-4 w-4', favorites.includes(targetLang) && 'fill-ember-500 text-ember-500')} />
            </button>
          </div>
          <div
            className="relative min-h-44 rounded-2xl border border-ink-200 bg-linear-to-br from-ink-50/80 to-ink-100/40 p-4 shadow-inner dark:border-ink-800 dark:from-ink-900/30 dark:to-ink-900/10"
            aria-live="polite"
            aria-busy={status === 'loading'}
          >
            {status === 'loading' ? (
              <div className="space-y-2">
                <div className="h-3.5 w-4/5 animate-pulse rounded bg-ink-200 dark:bg-ink-800" />
                <div className="h-3.5 w-3/5 animate-pulse rounded bg-ink-200 dark:bg-ink-800" />
                <div className="h-3.5 w-2/3 animate-pulse rounded bg-ink-200 dark:bg-ink-800" />
              </div>
            ) : status === 'error' ? (
              <p className="flex items-start gap-2 text-sm text-red-500">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {error?.message ?? 'Something went wrong.'}
              </p>
            ) : (
              <p className="text-[15px] whitespace-pre-wrap text-ink-800 dark:text-ink-100">
                {result || <span className="text-ink-300 dark:text-ink-600">Translation appears here.</span>}
              </p>
            )}
            <div className="absolute right-3 bottom-3 flex items-center gap-1">
              <button
                type="button"
                onClick={() => speak(result, targetLang)}
                disabled={!result}
                className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 disabled:opacity-30 dark:hover:bg-ink-800"
                aria-label="Read translation aloud"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!result}
                className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 disabled:opacity-30 dark:hover:bg-ink-800"
                aria-label="Copy translation"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSwap}
          disabled={sourceLang === 'auto'}
          className="flex items-center gap-1.5 rounded-full border border-ink-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-ink-500 shadow-sm transition-all hover:border-ember-500/40 hover:text-ember-600 hover:shadow disabled:cursor-not-allowed disabled:opacity-40 dark:border-ink-800 dark:bg-ink-900/40 dark:text-ink-400"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Swap
        </button>
        {favorites.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setTargetLang(code)}
            className={clsx(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              targetLang === code
                ? 'border-ember-500/50 bg-ember-500/10 text-ember-600 dark:text-ember-400'
                : 'border-ink-200 text-ink-500 hover:border-ember-500/40 hover:text-ember-600 dark:border-ink-800 dark:text-ink-400',
            )}
          >
            {languageName(code)}
          </button>
        ))}
        {status === 'loading' && (
          <span className="flex items-center gap-1.5 text-xs text-ink-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> translating…
          </span>
        )}
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
          <ul className="space-y-1.5">
            {history.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => restoreHistoryEntry(entry)}
                  className="w-full rounded-xl border border-transparent px-3 py-2 text-left text-sm transition-colors hover:border-ink-200 hover:bg-white/70 dark:hover:border-ink-800 dark:hover:bg-ink-900/40"
                >
                  <span className="text-ink-500 dark:text-ink-400">{truncate(entry.sourceText, 42)}</span>
                  <span className="mx-2 text-ink-300 dark:text-ink-600">→</span>
                  <span className="text-ink-800 dark:text-ink-100">{truncate(entry.translatedText, 42)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function LanguageSelect({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-ink-500 dark:text-ink-400">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-ink-200 bg-white/70 px-2 py-1 text-xs font-medium text-ink-700 focus:border-ember-500/50 focus:outline-none dark:border-ink-800 dark:bg-ink-900/40 dark:text-ink-200"
      >
        {options.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </label>
  )
}

function MissingKeyNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-ember-500/30 bg-ember-50 p-4 text-sm text-ember-900 dark:bg-ember-500/10 dark:text-ember-200">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="font-medium">No RapidAPI key configured</p>
        <p className="mt-1 text-[13px] leading-relaxed text-ember-800/90 dark:text-ember-200/80">
          Add a RapidAPI key to a <code className="rounded bg-black/5 px-1 dark:bg-white/10">.env</code> file at
          the project root:
        </p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-black/5 p-2 font-mono text-[12px] dark:bg-white/10">
          VITE_RAPIDAPI_KEY=your_key_here
        </pre>
        <p className="mt-1 text-[13px] text-ember-800/90 dark:text-ember-200/80">
          Then restart <code className="rounded bg-black/5 px-1 dark:bg-white/10">npm run dev</code>. See the
          README for how to get a key.
        </p>
      </div>
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

function truncate(value, max) {
  if (!value) return ''
  return value.length > max ? `${value.slice(0, max)}…` : value
}
