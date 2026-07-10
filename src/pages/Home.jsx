import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Dices, Languages } from 'lucide-react'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useLocalStorage } from '../lib/useLocalStorage'
import { languageName } from '../data/languages'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  useDocumentTitle('Anvil — Overview')
  const [stats] = useLocalStorage('anvil-stats', { translations: 0, characters: 0, strings: 0 })
  const [translationHistory] = useLocalStorage('anvil-translation-history', [])
  const [stringHistory] = useLocalStorage('anvil-string-history', [])

  const lastTranslation = translationHistory[0]
  const lastString = stringHistory[0]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
      <motion.div variants={item}>
        <p className="font-mono text-xs tracking-wider text-ember-600 uppercase dark:text-ember-400">
          Overview
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 sm:text-4xl dark:text-ink-50">
          A small workshop for everyday text.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-ink-500 dark:text-ink-400">
          Two focused tools, no clutter: translate a passage into another language, or forge a
          random string for a password or test fixture. Everything but the translation call stays
          on this device.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2">
        <ToolCard
          to="/translator"
          icon={Languages}
          title="Translator"
          description="Translate any passage into 30+ languages, with source-language detection and a running history of your lookups."
          stat={
            stats.translations
              ? `${stats.translations} translation${stats.translations === 1 ? '' : 's'} · ${stats.characters.toLocaleString()} characters`
              : 'No translations yet'
          }
          preview={
            lastTranslation
              ? `“${truncate(lastTranslation.sourceText)}” → “${truncate(lastTranslation.translatedText)}”`
              : 'Try: “See you tomorrow” → Japanese'
          }
        />
        <ToolCard
          to="/string-generator"
          icon={Dices}
          title="String Generator"
          description="Generate cryptographically random strings for passwords or tokens, with a live entropy score as you tune the options."
          stat={
            stats.strings
              ? `${stats.strings} string${stats.strings === 1 ? '' : 's'} forged`
              : 'Nothing forged yet'
          }
          preview={lastString ? lastString.value : 'Try: a 24-character token, symbols on'}
        />
      </motion.div>

      <motion.div
        variants={item}
        className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink-200 pt-6 text-xs text-ink-400 dark:border-ink-800"
      >
        <span>Built with React, Tailwind CSS &amp; React Router</span>
        {lastTranslation && (
          <span>
            Last translated to {languageName(lastTranslation.targetLang)} ·{' '}
            {timeAgo(lastTranslation.timestamp)}
          </span>
        )}
      </motion.div>
    </motion.div>
  )
}

function ToolCard({ to, icon: Icon, title, description, stat, preview }) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-ink-200 bg-white/70 p-6 transition-all hover:-translate-y-0.5 hover:border-ember-500/40 hover:shadow-lg hover:shadow-ink-950/5 dark:border-ink-800 dark:bg-ink-900/40"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-ember-400 dark:bg-ember-500/15 dark:text-ember-400">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <ArrowUpRight className="h-4 w-4 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember-500 dark:text-ink-600" />
      </div>
      <div>
        <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
          {description}
        </p>
      </div>
      <div className="mt-auto space-y-1.5 border-t border-ink-100 pt-3 dark:border-ink-800">
        <p className="truncate font-mono text-xs text-ink-400 dark:text-ink-500">{preview}</p>
        <p className="text-xs font-medium text-ember-600 dark:text-ember-400">{stat}</p>
      </div>
    </Link>
  )
}

function truncate(value, max = 24) {
  if (!value) return ''
  return value.length > max ? `${value.slice(0, max)}…` : value
}

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
