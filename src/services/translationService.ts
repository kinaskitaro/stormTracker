import type { Storm } from '../types'

interface TranslatePointResult {
  description: string
  funFact: string
}

// Cache for translated content to avoid re-translating
const translationCache = new Map<string, Map<string, string>>()

// Rate limiting: delay between API calls
const API_DELAY_MS = 1000 // 1000ms between requests
const BATCH_SIZE = 1      // Process 1 point at a time

/**
 * Delay utility for rate limiting
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Track consecutive failures to increase wait time
let consecutiveFailures = 0

/**
 * Translate text using Groq API (already set up, reliable)
 */
async function translateText(text: string, targetLang: 'vi' | 'en', retries = 3): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  if (!apiKey) {
    return text
  }

  const langName = targetLang === 'vi' ? 'Vietnamese' : 'English'
  
  const cacheKey = `${targetLang}:${text.substring(0, 100)}`
  if (translationCache.has(targetLang) && translationCache.get(targetLang)?.has(cacheKey)) {
    return translationCache.get(targetLang)!.get(cacheKey)!
  }

  if (consecutiveFailures > 0) {
    const penaltyDelay = consecutiveFailures * 2000
    await delay(penaltyDelay)
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the given text to ${langName}.
Keep technical terms like "Hurricane", "Tropical Depression", "Tropical Storm", "Category" in English when appropriate.
Keep numbers and measurements unchanged.
Keep emoji if present.
Return ONLY the translated text, no explanations or additional formatting.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      })

      if (response.status === 429) {
        consecutiveFailures++
        const data = await response.json()
        let waitTime = (attempt + 1) * 5000

        if (data.error?.message) {
          const match = data.error.message.match(/Please try again in ([\d.]+)ms/)
          if (match) {
            waitTime = Math.ceil(parseFloat(match[1])) + 500
          }
        }

        await delay(waitTime)
        continue
      }

      if (!response.ok) {
        return text
      }

      const data = await response.json()

      if (data.error) {
        return text
      }

      const translatedText = data.choices?.[0]?.message?.content?.trim()

      if (!translatedText) {
        return text
      }

      consecutiveFailures = 0

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
  targetLang: 'vi' | 'en'
): Promise<TranslatePointResult> {
  // If already in target language (English), return as-is
  if (targetLang === 'en') {
    return { description, funFact }
  }

  // Translate sequentially to avoid rate limiting
  const translatedDesc = await translateText(description, targetLang)
  await delay(API_DELAY_MS)  // Delay between requests
  const translatedFact = await translateText(funFact, targetLang)

  return {
    description: translatedDesc,
    funFact: translatedFact
  }
}

/**
 * Translate all points in a storm (batch translation with rate limiting)
 */
export async function translateStorm(storm: Storm, targetLang: 'vi' | 'en'): Promise<Storm> {
  // If target is English, return original
  if (targetLang === 'en') {
    return storm
  }

  // Process points in batches to avoid rate limiting
  const translatedPoints: typeof storm.points = []

  for (let i = 0; i < storm.points.length; i += BATCH_SIZE) {
    const batch = storm.points.slice(i, i + BATCH_SIZE)

    // Translate batch in parallel
    const batchResults = await Promise.all(
      batch.map(async (point) => {
        const translated = await translatePoint(point.description, point.funFact, targetLang)
        return {
          ...point,
          description: translated.description,
          funFact: translated.funFact
        }
      })
    )

    translatedPoints.push(...batchResults)

    // Delay between batches (except for the last batch)
    if (i + BATCH_SIZE < storm.points.length) {
      await delay(API_DELAY_MS * 3)
    }
  }

  return {
    ...storm,
    points: translatedPoints
  }
}

/**
 * Clear the translation cache (useful for testing)
 */
export function clearTranslationCache(): void {
  translationCache.clear()
}
