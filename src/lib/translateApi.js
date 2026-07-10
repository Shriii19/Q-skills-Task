const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST || 'text-translator2.p.rapidapi.com'
const RAPIDAPI_URL = import.meta.env.VITE_RAPIDAPI_URL || `https://${RAPIDAPI_HOST}/translate`

export class TranslationError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'TranslationError'
    this.code = code
  }
}

export function hasRapidApiKey() {
  return Boolean(RAPIDAPI_KEY)
}

// Targets the "Text Translator2" contract on RapidAPI (form-encoded request,
// { data: { translatedText } } response). Parsing below also tolerates a few
// sibling APIs' shapes, since VITE_RAPIDAPI_HOST/URL can point elsewhere.
export async function translateText({ text, source = 'auto', target, signal }) {
  if (!RAPIDAPI_KEY) {
    throw new TranslationError(
      'No RapidAPI key configured. Add VITE_RAPIDAPI_KEY to your .env file, then restart the dev server.',
      'missing_key',
    )
  }
  if (!text.trim()) {
    return { translatedText: '', detectedSource: source }
  }

  let response
  try {
    response = await fetch(RAPIDAPI_URL, {
      method: 'POST',
      signal,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
      body: new URLSearchParams({
        source_language: source,
        target_language: target,
        text,
      }),
    })
  } catch (cause) {
    if (cause?.name === 'AbortError') throw cause
    throw new TranslationError('Could not reach the translation service. Check your connection.', 'network')
  }

  if (response.status === 401 || response.status === 403) {
    throw new TranslationError('That RapidAPI key was rejected. Double-check it in .env.', 'unauthorized')
  }
  if (response.status === 429) {
    throw new TranslationError('Translation quota reached for this API key.', 'rate_limited')
  }
  if (!response.ok) {
    throw new TranslationError(`Translation service returned an error (${response.status}).`, 'server')
  }

  const payload = await response.json()

  const translated =
    payload?.data?.translatedText ??
    payload?.translatedText ??
    payload?.trans ??
    payload?.translation ??
    (typeof payload === 'string' ? payload : null)

  if (!translated) {
    throw new TranslationError('Unexpected response shape from the translation API.', 'parse')
  }

  const detected = payload?.data?.detectedSourceLanguage ?? payload?.detectedSourceLanguage ?? source

  return { translatedText: translated, detectedSource: detected }
}
