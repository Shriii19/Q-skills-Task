export const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

const AMBIGUOUS = /[Il1O0]/g

export function buildAlphabet(options) {
  let alphabet = ''
  if (options.uppercase) alphabet += CHARSETS.uppercase
  if (options.lowercase) alphabet += CHARSETS.lowercase
  if (options.numbers) alphabet += CHARSETS.numbers
  if (options.symbols) alphabet += CHARSETS.symbols
  if (options.excludeAmbiguous) alphabet = alphabet.replace(AMBIGUOUS, '')
  return alphabet
}

// crypto.getRandomValues avoids Math.random's modulo bias and is suitable
// for values a user might actually use as a password or token.
export function generateRandomString(length, alphabet) {
  if (!alphabet) return ''
  const maxUint32 = 0xffffffff
  const limit = maxUint32 - (maxUint32 % alphabet.length)
  const result = []
  const buffer = new Uint32Array(1)

  while (result.length < length) {
    window.crypto.getRandomValues(buffer)
    if (buffer[0] > limit) continue // discard to avoid modulo bias
    result.push(alphabet[buffer[0] % alphabet.length])
  }
  return result.join('')
}

export function calculateEntropyBits(length, alphabetSize) {
  if (alphabetSize <= 1 || length <= 0) return 0
  return Math.round(length * Math.log2(alphabetSize))
}

export function strengthLabel(bits) {
  if (bits >= 100) return { label: 'Excellent', tone: 'excellent' }
  if (bits >= 70) return { label: 'Strong', tone: 'strong' }
  if (bits >= 45) return { label: 'Fair', tone: 'fair' }
  return { label: 'Weak', tone: 'weak' }
}
