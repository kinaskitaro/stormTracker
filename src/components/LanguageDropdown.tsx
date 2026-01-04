import { useLanguage } from '../contexts/LanguageContext'
import type { Language } from '../translations'
import './LanguageDropdown.css'

export function LanguageDropdown() {
  const { language, setLanguage } = useLanguage()

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
  ]

  const currentLang = languages.find(l => l.code === language)

  return (
    <div className="language-dropdown">
      <label htmlFor="language-select" className="language-label">
        {currentLang?.flag} <span className="language-name">{currentLang?.name}</span>
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="language-select"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}
