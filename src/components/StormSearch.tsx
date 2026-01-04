import { useState } from 'react'
import { Sparkles, Loader2, Calendar } from 'lucide-react'
import { searchStorms } from '../stormData'
import { searchStormWithAI } from '../services/groqStormService'
import type { Storm } from '../types'

interface StormSearchProps {
  onStormSelect: (storm: Storm) => void
}

export function StormSearch({ onStormSelect }: StormSearchProps) {
  const [query, setQuery] = useState('')
  const [year, setYear] = useState('')
  const [results, setResults] = useState<Storm[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setError(null)
    if (searchQuery.trim()) {
      const found = searchStorms(searchQuery)
      setResults(found)
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }

  const handleAISearch = async () => {
    if (!query.trim()) {
      return
    }

    setIsLoading(true)
    setError(null)
    setResults([])

    try {
      const searchQuery = year.trim() ? `${query} ${year}` : query
      const storm = await searchStormWithAI(searchQuery)

      if (storm) {
        handleSelect(storm)
      } else {
        throw new Error('No storm found. Try a different search term.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search with AI'
      setError(errorMessage)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (storm: Storm) => {
    onStormSelect(storm)
    setQuery('')
    setYear('')
    setResults([])
    setShowResults(false)
    setError(null)
  }

  return (
    <div className="search-container" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1 }}>
        <input
          type="text"
          className="search-input"
          placeholder="Storm name (e.g., Katrina, Ian, Trami)"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          disabled={isLoading}
          style={{ flex: 1 }}
        />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Calendar size={18} style={{ position: 'absolute', left: '14px', color: '#9B59B6', pointerEvents: 'none' }} />
          <input
            type="number"
            className="search-input"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={isLoading}
            style={{
              width: '140px',
              minWidth: '140px',
              paddingLeft: '2.6rem',
              borderColor: year ? '#9B59B6' : undefined,
              borderWidth: year ? '3px' : undefined,
              fontWeight: year ? '600' : 'normal'
            }}
            min="1900"
            max="2099"
            title="Add year for storms with same name (e.g., Katrina 2005 vs Katrina 2024)"
          />
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleAISearch()
          }}
          className="search-button"
          style={{ background: '#9B59B6' }}
          disabled={isLoading || !query.trim()}
          aria-label="Search with AI"
          title="Search storm database with AI analysis (powered by Groq)"
        >
          {isLoading ? <Loader2 size={22} className="spin" /> : <Sparkles size={22} />}
        </button>
      </div>

      {error && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          padding: '0.8rem',
          marginTop: '0.5rem',
          background: '#FFEBEE',
          borderRadius: '10px',
          color: '#C62828',
          fontSize: '0.9rem',
          border: '2px solid #FFCDD2',
          zIndex: 10000,
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
        }}>
          {error}
        </div>
      )}

      {showResults && results.length > 0 && !isLoading && (
        <div className="search-results" style={{ zIndex: 10001 }}>
          {results.map((storm) => (
            <div
              key={storm.id}
              className="search-result-item"
              onClick={() => handleSelect(storm)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSelect(storm)
              }}
            >
              <span className="search-result-emoji">{storm.emoji}</span>
              <div>
                <div className="search-result-name">{storm.name}</div>
                <div className="search-result-id">
                  {storm.points.length} points tracked
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && query && results.length === 0 && !isLoading && (
        <div className="search-results">
          <div style={{ padding: '1rem', textAlign: 'center', color: '#7F8C8D' }}>
            No storms found matching "{query}"
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              Click ✨ to search storm database with AI analysis!
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#9B59B6', fontWeight: '500' }}>
              💡 Searches IBTrACS & BST files with AI-powered analysis
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
