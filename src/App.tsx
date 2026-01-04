import { useState } from 'react'
import { StormSearch } from './components/StormSearch'
import { StormMap } from './components/StormMap'
import { InfoPanel } from './components/InfoPanel'
import { LanguageDropdown } from './components/LanguageDropdown'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import type { Storm, StormPoint } from './types'
import './App.css'

function AppContent() {
  const { t, translatedStorm, setOriginalStorm, isTranslating } = useLanguage()
  const [selectedPoint, setSelectedPoint] = useState<StormPoint | null>(null)

  const handleStormSelect = (storm: Storm) => {
    setOriginalStorm(storm)
    setSelectedPoint(null)
  }

  const handlePointClick = (point: StormPoint) => {
    setSelectedPoint(point)
  }

  // Use translated storm for display, original for map coordinates
  const stormForDisplay = translatedStorm
  const stormForMap = translatedStorm

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <span className="header-emoji">🌀</span>
            <h1>{t.title}</h1>
          </div>
          <div className="header-center">
            <LanguageDropdown />
          </div>
          <div className="header-controls">
            <StormSearch onStormSelect={handleStormSelect} />
          </div>
        </div>
      </header>

      <main className="main-content">
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
          <StormMap
            storm={stormForMap}
            onPointClick={handlePointClick}
          />
        </div>

        <InfoPanel
          storm={stormForDisplay}
          selectedPoint={selectedPoint}
          isLoading={isTranslating}
        />
      </main>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
