import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Language, Translations } from '../translations'
import type { Storm } from '../types'
import { translations } from '../translations'
import { translateStorm } from '../services/translationService'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  translatedStorm: Storm | null
  setOriginalStorm: (storm: Storm | null) => void
  isTranslating: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [originalStorm, setOriginalStorm] = useState<Storm | null>(null)
  const [translatedStorm, setTranslatedStorm] = useState<Storm | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  // Translate storm when language changes
  useEffect(() => {
    if (originalStorm) {
      const translate = async () => {
        setIsTranslating(true)
        try {
          const translated = await translateStorm(originalStorm, language)
          setTranslatedStorm(translated)
        } catch (error) {
          console.error('Translation error:', error)
          setTranslatedStorm(originalStorm)
        } finally {
          setIsTranslating(false)
        }
      }

      // Use Vietnamese if selected, otherwise use original (English)
      if (language === 'vi') {
        translate()
      } else {
        setTranslatedStorm(originalStorm)
      }
    } else {
      setTranslatedStorm(null)
    }
  }, [originalStorm, language])

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang)
  }, [])

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language],
    translatedStorm,
    setOriginalStorm: setOriginalStorm,
    isTranslating
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
