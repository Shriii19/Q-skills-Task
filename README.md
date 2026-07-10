# Anvil

A small workshop of everyday text tools, built with React, React Router, and Tailwind CSS.

- **Translator** — translate a passage into 30+ languages through a RapidAPI translation
  endpoint, with source-language detection, favorite target languages, read-aloud, and a
  local history of recent lookups.
- **String Generator** — generate cryptographically random strings (`crypto.getRandomValues`,
  not `Math.random`) with configurable character sets, live entropy scoring, and a strength
  meter.
- **Client-side routing** via `react-router-dom`, with a persistent sidebar/mobile-drawer shell,
  dark mode, and animated route transitions.

Everything except the translation API call runs entirely in the browser — history, favorites,
theme, and usage stats persist to `localStorage`, nothing is sent to a backend of ours (there
isn't one).

## Setup

```bash
npm install
cp .env.example .env
```

Then add a RapidAPI key to `.env`:

```
VITE_RAPIDAPI_KEY=your_key_here
```

To get one: create a free account at rapidapi.com, subscribe to a text translation API (the
free tier is enough), and copy the key shown in that API's code snippet. The app is wired up
for the **Text Translator2** API by default (`text-translator2.p.rapidapi.com`) — if you
subscribe to a different one instead, override `VITE_RAPIDAPI_HOST` / `VITE_RAPIDAPI_URL` in
`.env` to match, no code changes needed as long as the API accepts a
`{ source_language, target_language, text }` payload. The String Generator needs no API key.

```bash
npm run dev
```

## Scripts

| Command           | Purpose                          |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the dev server with HMR     |
| `npm run build`   | Type-check-free production build  |
| `npm run preview` | Preview the production build      |
| `npm run lint`    | Run Oxlint                         |

## Project structure

```
src/
  components/layout/   AppShell — sidebar, mobile nav, theme toggle, route transitions
  context/              ThemeContext, ToastContext
  data/                 Language list for the translator
  lib/                  Random string logic, RapidAPI client, small hooks
  pages/                Home, Translator, StringGenerator, NotFound
```

## Stack

React 19 · React Router 7 · Tailwind CSS 4 · Framer Motion · lucide-react · Vite
