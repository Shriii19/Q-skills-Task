import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Dices, Languages, Activity, Hash, Type, Clock } from 'lucide-react'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useLocalStorage } from '../lib/useLocalStorage'
import { languageName } from '../data/languages'
import StatsCard from '../components/ui/StatsCard'

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
  const hasActivity = stats.translations > 0 || stats.strings > 0

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
      <motion.div variants={item}>
        <p className="font-mono text-xs tracking-wider text-ember-600 uppercase dark:text-ember-400">
          Overview
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          <span className="text-gradient bg-linear-to-r from-ink-900 via-ink-800 to-ink-700 dark:from-ink-50 dark:via-ink-100 dark:to-ink-200">
            A small workshop
          </span>
          <br />
          <span className="text-gradient bg-linear-to-r from-ember-600 to-ember-500 dark:from-ember-400 dark:to-ember-300">
            for everyday text.
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-ink-500 dark:text-ink-400">
          Two focused tools, no clutter: translate a passage into another language, or forge a
          random string for a password or test fixture. Everything but the translation call stays
          on this device.
        </p>
      </motion.div>

      {hasActivity && (
        <motion.div variants={item}>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-700 dark:text-ink-300">
            <Activity className="h-4 w-4" />
            Your Activity
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              icon={Languages}
              label="Translations"
              value={stats.translations}
              color="ember"
            />
            <StatsCard
              icon={Type}
              label="Characters"
              value={stats.characters}
              color="blue"
            />
            <StatsCard
              icon={Hash}
              label="Strings"
              value={stats.strings}
              color="purple"
            />
            <StatsCard
              icon={Clock}
              label="Recent Items"
              value={translationHistory.length + stringHistory.length}
              trend="in history"
              color="green"
            />
          </div>
        </motion.div>
      )}

      <motion.div variants={item}>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-700 dark:text-ink-300">
          <Dices className="h-4 w-4" />
          Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-ink-100 bg-ink-50/60 px-4 py-3 text-xs text-ink-400 dark:border-ink-800/60 dark:bg-ink-900/20"
      >
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Built with React, Tailwind CSS &amp; React Router
        </span>
        {lastTranslation && (
          <span>
            Last translated to {languageName(lastTranslation.targetLang)} ·{' '}
            {timeAgo(lastTranslation.timestamp)}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <span className="text-ink-300 dark:text-ink-600">•</span>
          Press <kbd className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[10px] dark:bg-ink-800">⌘K</kbd> for quick actions
        </span>
      </motion.div>
    </motion.div>
  )
}

function ToolCard({ to, icon: Icon, title, description, stat, preview }) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-ink-200 bg-white/70 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-ember-500/40 hover:shadow-xl hover:shadow-ink-950/8 dark:border-ink-800 dark:bg-ink-900/40 dark:hover:border-ember-500/30 dark:hover:shadow-ink-950/30"
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-ember-500/0 to-ember-500/0 transition-all duration-300 group-hover:from-ember-500/3 group-hover:to-transparent dark:group-hover:from-ember-500/6" />
      <div className="relative flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-ink-800 to-ink-950 text-ember-400 shadow-md shadow-ink-950/20 transition-transform duration-200 group-hover:scale-105 dark:from-ember-500/20 dark:to-ember-600/10 dark:text-ember-400 dark:shadow-none">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <ArrowUpRight className="h-4 w-4 text-ink-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember-500 dark:text-ink-600" />
      </div>
      <div className="relative">
        <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
          {description}
        </p>
      </div>
      <div className="relative mt-auto space-y-1.5 rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-2.5 dark:border-ink-800 dark:bg-ink-800/30">
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
