import type { Storm } from '../types'

interface TranslatePointResult {
  description: string
  funFact: string
}

// Cache for translated content to avoid re-translating
const translationCache = new Map<string, Map<string, string>>()

// Rate limiting: delay between API calls
const API_DELAY_MS = 300 // 300ms between requests (MyMemory is more lenient)
const BATCH_SIZE = 3     // Process 3 points at a time

/**
 * Delay utility for rate limiting
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Track consecutive failures
let consecutiveFailures = 0

/**
 * Supported languages for MyMemory API
 */
const LANGUAGE_MAP: Record<string, string> = {
  'en': 'en', // English
  'vi': 'vi', // Vietnamese
  'es': 'es', // Spanish
  'fr': 'fr', // French
  'de': 'de', // German
  'ja': 'ja', // Japanese
  'ko': 'ko', // Korean
  'zh': 'zh', // Chinese
  'ru': 'ru', // Russian
  'pt': 'pt', // Portuguese
  'it': 'it', // Italian
  'ar': 'ar', // Arabic
  'hi': 'hi', // Hindi
  'th': 'th', // Thai
  'id': 'id', // Indonesian
  'ms': 'ms', // Malay
  'tr': 'tr', // Turkish
  'pl': 'pl', // Polish
  'nl': 'nl', // Dutch
  'sv': 'sv', // Swedish
}

/**
 * Get MyMemory language code
 */
function getMyMemoryLang(lang: string): string {
  return LANGUAGE_MAP[lang] || 'en'
}

/**
 * Translate text using MyMemory API (FREE, no API key required)
 * MyMemory is a free translation API that uses multiple sources including Google Translate
 * Limit: 10,000 words per day for free usage
 */
async function translateText(text: string, targetLang: string, sourceLang: string = 'en', retries = 3): Promise<string> {
  // If source and target are the same, return as-is
  if (sourceLang === targetLang) {
    return text
  }

  const targetCode = getMyMemoryLang(targetLang)
  const sourceCode = getMyMemoryLang(sourceLang)

  // Cache key
  const cacheKey = `${sourceCode}|${targetCode}:${text.substring(0, 100)}`
  if (translationCache.has(targetLang) && translationCache.get(targetLang)?.has(cacheKey)) {
    return translationCache.get(targetLang)!.get(cacheKey)!
  }

  // Backoff on consecutive failures
  if (consecutiveFailures > 0) {
    const penaltyDelay = consecutiveFailures * 500
    await delay(penaltyDelay)
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // MyMemory API - FREE, no API key needed
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceCode}|${targetCode}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        if (response.status === 429) {
          consecutiveFailures++
          await delay(2000 * (attempt + 1))
          continue
        }
        return text
      }

      const data = await response.json()

      // Check for API errors
      if (data.responseStatus !== 200) {
        // Try again after delay
        if (attempt < retries) {
          await delay(1000)
          continue
        }
        return text
      }

      const translatedText = data.responseData?.translatedText

      if (!translatedText) {
        return text
      }

      // Reset failure counter on success
      consecutiveFailures = 0

      // Cache the result
      if (!translationCache.has(targetLang)) {
        translationCache.set(targetLang, new Map())
      }
      translationCache.get(targetLang)!.set(cacheKey, translatedText)

      return translatedText

    } catch (error) {
      if (attempt === retries) {
        return text
      }
      await delay(1000)
    }
  }

  return text
}

/**
 * Translate a single point's description and fun fact
 */
export async function translatePoint(
  description: string,
  funFact: string,
  targetLang: string,
  sourceLang: string = 'en'
): Promise<TranslatePointResult> {
  // If already in target language, return as-is
  if (sourceLang === targetLang) {
    return { description, funFact }
  }

  // Translate in sequence to respect rate limits
  const translatedDesc = await translateText(description, targetLang, sourceLang)
  await delay(API_DELAY_MS)
  const translatedFact = await translateText(funFact, targetLang, sourceLang)

  return {
    description: translatedDesc,
    funFact: translatedFact
  }
}

/**
 * Translate all points in a storm (batch translation with rate limiting)
 */
export async function translateStorm(storm: Storm, targetLang: string, sourceLang: string = 'en'): Promise<Storm> {
  // If target is same as source, return original
  if (sourceLang === targetLang) {
    return storm
  }

  // Process points in batches
  const translatedPoints: typeof storm.points = []

  for (let i = 0; i < storm.points.length; i += BATCH_SIZE) {
    const batch = storm.points.slice(i, i + BATCH_SIZE)

    // Translate batch in parallel
    const batchResults = await Promise.all(
      batch.map(async (point) => {
        const translated = await translatePoint(point.description, point.funFact, targetLang, sourceLang)
        return {
          ...point,
          description: translated.description,
          funFact: translated.funFact
        }
      })
    )

    translatedPoints.push(...batchResults)

    // Delay between batches
    if (i + BATCH_SIZE < storm.points.length) {
      await delay(API_DELAY_MS * 2)
    }
  }

  return {
    ...storm,
    points: translatedPoints
  }
}

/**
 * Get list of supported languages
 */
export function getSupportedLanguages(): string[] {
  return Object.keys(LANGUAGE_MAP)
}

/**
 * Clear the translation cache
 */
export function clearTranslationCache(): void {
  translationCache.clear()
}

/**
 * Get translation cache stats
 */
export function getCacheStats(): { size: number; languages: string[] } {
  return {
    size: translationCache.size,
    languages: Array.from(translationCache.keys())
  }
}
