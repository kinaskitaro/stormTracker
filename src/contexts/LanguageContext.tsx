import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Language, Translations } from '../translations'
import type { Storm } from '../types'
import { translations } from '../translations'
import { translateStorm as translateStormGroq } from '../services/translationService'
import { translateStorm as translateStormFree } from '../services/freeTranslationService'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  translatedStorm: Storm | null
  setOriginalStorm: (storm: Storm | null) => void
  isTranslating: boolean
  translationService: 'groq' | 'free'
  setTranslationService: (service: 'groq' | 'free') => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [originalStorm, setOriginalStorm] = useState<Storm | null>(null)
  const [translatedStorm, setTranslatedStorm] = useState<Storm | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationService, setTranslationService] = useState<'groq' | 'free'>('free')

  // Translate storm when language changes or translation service changes
  useEffect(() => {
    if (originalStorm) {
      const translate = async () => {
        setIsTranslating(true)
        try {
          // Use selected translation service
          const translated = translationService === 'groq'
            ? await translateStormGroq(originalStorm, language as 'vi' | 'en')
            : await translateStormFree(originalStorm, language, 'en')
          setTranslatedStorm(translated)
        } catch (error) {
          setTranslatedStorm(originalStorm)
        } finally {
          setIsTranslating(false)
        }
      }

      // Only translate if not English
      if (language !== 'en') {
        translate()
      } else {
        setTranslatedStorm(originalStorm)
      }
    } else {
      setTranslatedStorm(null)
    }
  }, [originalStorm, language, translationService])

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang)
  }, [])

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language],
    translatedStorm,
    setOriginalStorm: setOriginalStorm,
    isTranslating,
    translationService,
    setTranslationService
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
