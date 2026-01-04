import type { Storm, StormPoint } from '../types'
import { useLanguage } from '../contexts/LanguageContext'

interface InfoPanelProps {
  storm: Storm | null
  selectedPoint: StormPoint | null
  isLoading?: boolean
}

export function InfoPanel({ storm, selectedPoint, isLoading }: InfoPanelProps) {
  const { t, language } = useLanguage()

  if (!storm) {
    return (
      <div className="info-panel">
        <div className="no-storm-message">
          <div className="no-storm-emoji">🌍</div>
          <div className="no-storm-text">{t.noStormSelected}</div>
          <div className="no-storm-subtext">{t.noStormSubtext}</div>
        </div>
      </div>
    )
  }

  const pointsToShow = selectedPoint
    ? storm.points.filter(p => p.id === selectedPoint.id)
    : storm.points

  const year = storm.points[0]?.timestamp ? new Date(storm.points[0].timestamp).getFullYear() : null

  return (
    <div className="info-panel">
      {isLoading && (
        <div className="translation-loading">
          <span className="loading-spinner">🔄</span>
          <span>{language === 'vi' ? 'Đang dịch...' : 'Translating...'}</span>
        </div>
      )}

      <div className="info-panel-header">
        <div className="info-panel-title">
          <span className="info-panel-emoji">{storm.emoji}</span>
          <h2>{storm.name}</h2>
          {year && <span style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '0.3rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            marginLeft: '0.5rem'
          }}>
            {year}
          </span>}
        </div>
        <p style={{ color: '#7F8C8D', marginTop: '0.5rem' }}>
          {storm.points.length} {t.trackingPoints}
        </p>
      </div>

      {pointsToShow.length === 0 ? (
        <div className="no-storm-message">
          <div className="no-storm-emoji">📍</div>
          <div className="no-storm-text">{t.noPointSelected}</div>
          <div className="no-storm-subtext">{t.noPointSubtext}</div>
        </div>
      ) : (
        pointsToShow.map((point) => (
          <PointCard key={point.id} point={point} stormColor={storm.color} language={language} />
        ))
      )}
    </div>
  )
}

interface PointCardProps {
  point: StormPoint
  stormColor: string
  language: string
}

function PointCard({ point, stormColor, language }: PointCardProps) {
  const { t } = useLanguage()

  const getCategoryLabel = (category: number): string => {
    if (category === -1) return t.tropicalDepression
    if (category === 0) return t.tropicalStorm
    if (category >= 1 && category <= 5) return `${t.hurricaneCat} ${category}`
    return t.tropicalDepression
  }

  return (
    <div className="point-card" style={{ borderLeftColor: stormColor }}>
      <div className="point-card-header">
        <h3 className="point-name">{point.name}</h3>
        <span className="point-category">{getCategoryLabel(point.category)}</span>
      </div>

      <div className="point-date">
        <span>📅</span>
        <span>{formatDate(point.timestamp, language)}</span>
      </div>

      <p className="point-description">{point.description}</p>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon">💨</div>
          <div className="stat-value">{point.windSpeed.toFixed(1)}</div>
          <div className="stat-label">{t.mphWinds}</div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">🌡️</div>
          <div className="stat-value">{point.pressure}</div>
          <div className="stat-label">{t.mbPressure}</div>
        </div>
      </div>

      <div className="fun-fact">
        <div className="fun-fact-label">
          <span>💡</span>
          <span>{t.funFact}</span>
        </div>
        <p className="fun-fact-text">{point.funFact}</p>
      </div>
    </div>
  )
}

function formatDate(timestamp: string, language: string): string {
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) {
    return timestamp
  }
  return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
