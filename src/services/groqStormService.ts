// Groq AI Service for Storm Tracker
// Free, fast AI service using Llama 3.3 70B model
// Get your API key at: https://console.groq.com/keys

import type { Storm } from '../types'

// ============================================
// UTILITIES
// ============================================

const STORM_COLORS = [
  '#FF6B6B', '#4ECDC4', '#A855F7', '#3B82F6',
  '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'
]

const STORM_EMOJIS = ['🌀', '🌪️', '⛈️', '🌊', '💨', '🌧️', '⚡', '🔥']

function getRandomColor(): string {
  return STORM_COLORS[Math.floor(Math.random() * STORM_COLORS.length)]
}

function getRandomEmoji(): string {
  return STORM_EMOJIS[Math.floor(Math.random() * STORM_EMOJIS.length)]
}

// ============================================
// DATA PARSING
// ============================================

interface CSVStormData {
  name: string
  season: string
  basin: string
  points: Array<{
    timestamp: string
    lat: number
    lng: number
    windSpeed: number
    pressure: number
    hasRealWind: boolean  // true if wind came from CSV, false if estimated
    hasRealPressure: boolean  // true if pressure came from CSV, false if default
  }>
}

interface BSTStormData {
  name: string
  year: string
  points: Array<{
    timestamp: string
    lat: number
    lng: number
    pressure: number
    windSpeed?: number
  }>
}

async function searchIBTrACSCSV(name: string, year?: string): Promise<CSVStormData | null> {
  try {
    const response = await fetch('/IBTrACS_last3years_1bcb_f875_aa83.csv')
    const csvText = await response.text()
    const lines = csvText.split('\n').filter(line => line.trim())

    if (lines.length < 3) {
      return null
    }

    const searchName = name.toUpperCase().trim()
    const searchYear = year ? year.trim() : ''

    let matchedData: CSVStormData | null = null

    for (let i = 2; i < lines.length; i++) {
      const line = lines[i]
      const values = line.split(',')

      if (values.length < 10) continue

      const timestamp = values[0]?.trim()
      const stormName = values[4]?.toUpperCase().trim()
      const season = values[2]?.trim()
      const lat = parseFloat(values[5])
      const lng = parseFloat(values[6])
      const wind = parseFloat(values[7])
      const pressure = parseFloat(values[8])
      const basin = values[9]?.trim()

      const nameMatch = stormName === searchName
      const yearMatch = !searchYear || season === searchYear

      if (nameMatch && yearMatch) {
        if (!matchedData) {
          matchedData = {
            name: values[4] || name,
            season: season,
            basin: basin || 'Unknown',
            points: []
          }
        }

        if (!isNaN(lat) && !isNaN(lng)) {
          const hasRealPressure = !isNaN(pressure)
          const hasRealWind = !isNaN(wind) && wind > 0
          const pressureValue = hasRealPressure ? pressure : 1005
          const windValue = hasRealWind ? wind : 0
          const windSpeedMph = windValue * 1.15078

          matchedData.points.push({
            timestamp,
            lat,
            lng,
            windSpeed: windSpeedMph,
            pressure: pressureValue,
            hasRealWind,
            hasRealPressure
          })
        }
      }
    }

    return matchedData?.points.length ? matchedData : null
  } catch (error) {
    console.error('Error reading IBTrACS CSV:', error)
    return null
  }
}

async function searchBSTFile(name: string, year?: string): Promise<BSTStormData | null> {
  try {
    const response = await fetch('/bst_all.txt')
    const text = await response.text()
    const lines = text.split('\n').filter(line => line.trim())

    const searchName = name.toUpperCase().trim()
    const searchYear = year ? year.trim() : ''

    let matchedStorm: BSTStormData | null = null
    let currentStormName = ''
    let currentYear = ''
    let currentPoints: Array<{ timestamp: string; lat: number; lng: number; pressure: number }> = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.startsWith('66666')) {
        // Check if previous storm was a match
        if (currentPoints.length > 0) {
          const nameMatch = currentStormName === searchName
          const yearMatch = !searchYear || currentYear === searchYear

          if (nameMatch && yearMatch) {
            matchedStorm = {
              name: currentStormName,
              year: currentYear,
              points: currentPoints
            }
          }
        }

        // Start new storm
        const parts = line.trim().split(/\s+/)
        const dateStr = parts[parts.length - 1]
        currentYear = dateStr.substring(0, 4)

        if (parts.length >= 8 && parts[7].length > 4) {
          currentStormName = parts[7].toUpperCase().trim()
        } else {
          currentStormName = ''
        }

        currentPoints = []
      } else {
        if (matchedStorm) {
          continue
        }

        const parts = line.trim().split(/\s+/)
        if (parts.length < 6) continue

        const dateTimeStr = parts[0]

        if (dateTimeStr.length < 8) continue

        const latTenths = parseInt(parts[3])
        const lngTenths = parseInt(parts[4])
        const pressure = parseInt(parts[5])

        if (isNaN(latTenths) || isNaN(lngTenths) || isNaN(pressure)) continue

        const lat = latTenths / 10
        const lng = lngTenths / 10
        const year2digit = parseInt(dateTimeStr.substring(0, 2))
        const month = parseInt(dateTimeStr.substring(2, 4))
        const day = parseInt(dateTimeStr.substring(4, 6))
        const hour = parseInt(dateTimeStr.substring(6, 8))

        const fullYear = year2digit > 50 ? 1900 + year2digit : 2000 + year2digit
        const timestamp = `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00:00`

        currentPoints.push({
          timestamp,
          lat,
          lng,
          pressure
        })
      }
    }

    // Check last storm
    if (!matchedStorm && currentPoints.length > 0) {
      const nameMatch = currentStormName === searchName
      const yearMatch = !searchYear || currentYear === searchYear

      if (nameMatch && yearMatch) {
        matchedStorm = {
          name: currentStormName,
          year: currentYear,
          points: currentPoints
        }
      }
    }

    return matchedStorm?.points.length ? matchedStorm : null
  } catch (error) {
    console.error('Error reading BST file:', error)
    return null
  }
}

// ============================================
// GROQ API CLIENT (FREE)
// ============================================

async function callGroq(
  messages: Array<{ role: string; content: string }>,
  jsonMode = false
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  if (!apiKey) {
    throw new Error(
      'Groq API key not found. Please add VITE_GROQ_API_KEY to your .env file. ' +
      'Get a FREE key at https://console.groq.com/keys'
    )
  }

  const requestBody: any = {
    model: 'llama-3.1-8b-instant',
    messages,
    temperature: 0.7,
    max_tokens: 4000
  }

  if (jsonMode) {
    requestBody.response_format = { type: 'json_object' }
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Groq API error: ${response.status} - ${error}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(`Groq API error: ${data.error.message}`)
  }

  return data.choices[0].message.content
}

function extractJSON(content: string): string {
  let jsonString = content.trim()
  const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    jsonString = codeBlockMatch[1].trim()
  }
  return jsonString
}

function getCategoryFromWind(windSpeedMph: number): number {
  if (windSpeedMph >= 157) return 5
  if (windSpeedMph >= 130) return 4
  if (windSpeedMph >= 111) return 3
  if (windSpeedMph >= 96) return 2
  if (windSpeedMph >= 74) return 1
  return 0
}

function estimateWindFromPressure(pressure: number): number {
  if (pressure < 920) return 165
  if (pressure < 935) return 145
  if (pressure < 950) return 125
  if (pressure < 965) return 100
  if (pressure < 980) return 80
  if (pressure < 1000) return 50
  return 30
}

function createStormFromCSVData(csvData: CSVStormData): Storm {
  const stormId = `${csvData.name.toLowerCase()}-${csvData.season}-${Date.now()}`
  
  const points = csvData.points
    .filter(p => !isNaN(p.lat) && !isNaN(p.lng))
    .map((point, index, arr) => {
      const category = getCategoryFromWind(point.windSpeed)
      const windSpeed = point.windSpeed || estimateWindFromPressure(point.pressure)
      
      let description = ''
      if (index === 0) {
        description = `${csvData.name} formed at this location in the ${csvData.basin} basin. Initial intensity was category ${category} with winds of ${windSpeed.toFixed(0)} mph.`
      } else if (index === arr.length - 1) {
        description = `${csvData.name} dissipated at this location, marking the end of its journey. The storm reached a maximum intensity of category ${Math.max(...arr.map(p => getCategoryFromWind(p.windSpeed || estimateWindFromPressure(p.pressure))))}.`
      } else {
        const prevCategory = getCategoryFromWind(arr[index - 1].windSpeed || estimateWindFromPressure(arr[index - 1].pressure))
        if (category > prevCategory) {
          description = `${csvData.name} strengthened to category ${category} at this location. Wind speeds increased to ${windSpeed.toFixed(0)} mph as the storm intensified.`
        } else if (category < prevCategory) {
          description = `${csvData.name} weakened to category ${category} at this location. Wind speeds dropped to ${windSpeed.toFixed(0)} mph as conditions changed.`
        } else {
          description = `${csvData.name} maintained category ${category} intensity at this location. The storm had winds of ${windSpeed.toFixed(0)} mph and a pressure of ${point.pressure} mb.`
        }
      }
      
      return {
        id: `${stormId}-${index}`,
        name: index === 0 ? 'Formation' : (index === arr.length - 1 ? 'Dissipation' : `Position ${index + 1}`),
        lat: point.lat,
        lng: point.lng,
        category,
        windSpeed,
        pressure: point.pressure,
        description,
        funFact: 'Tropical cyclones get their energy from warm ocean waters. Category 5 hurricanes can produce winds over 157 mph!',
        timestamp: point.timestamp
      }
    })
  
  return {
    id: stormId,
    name: csvData.name,
    emoji: getRandomEmoji(),
    color: getRandomColor(),
    points
  }
}

function createStormFromBSTData(bstData: BSTStormData): Storm {
  const stormId = `${bstData.name.toLowerCase()}-${bstData.year}-${Date.now()}`
  
  const points = bstData.points
    .filter(p => !isNaN(p.lat) && !isNaN(p.lng))
    .map((point, index, arr) => {
      const windSpeed = estimateWindFromPressure(point.pressure)
      const category = getCategoryFromWind(windSpeed)
      
      let description = ''
      if (index === 0) {
        description = `${bstData.name} formed at this location in ${bstData.year}. Initial intensity was category ${category} with a central pressure of ${point.pressure} mb.`
      } else if (index === arr.length - 1) {
        description = `${bstData.name} dissipated at this location, marking the end of its track in ${bstData.year}. Maximum recorded pressure was ${Math.min(...arr.map(p => p.pressure))} mb.`
      } else {
        const prevPressure = arr[index - 1].pressure
        if (point.pressure < prevPressure) {
          description = `${bstData.name} intensified at this location. Pressure dropped to ${point.pressure} mb as the storm strengthened.`
        } else if (point.pressure > prevPressure) {
          description = `${bstData.name} weakened at this location. Pressure rose to ${point.pressure} mb as the storm lost intensity.`
        } else {
          description = `${bstData.name} maintained intensity at this location with ${point.pressure} mb central pressure. Category ${category} storms can cause significant damage.`
        }
      }
      
      return {
        id: `${stormId}-${index}`,
        name: index === 0 ? 'Formation' : (index === arr.length - 1 ? 'Dissipation' : `Position ${index + 1}`),
        lat: point.lat,
        lng: point.lng,
        category,
        windSpeed,
        pressure: point.pressure,
        description,
        funFact: 'Historical storm records help scientists understand climate patterns and improve forecasting. Lower pressure means stronger storms!',
        timestamp: point.timestamp
      }
    })
  
  return {
    id: stormId,
    name: bstData.name,
    emoji: getRandomEmoji(),
    color: getRandomColor(),
    points
  }
}

async function enhanceStormWithAI(storm: Storm): Promise<Storm> {
  const pointsSummary = storm.points.map((p, i) =>
    `${i + 1}. ${p.timestamp}: Lat ${p.lat.toFixed(2)}, Lng ${p.lng.toFixed(2)}, Cat ${p.category}, ${p.windSpeed.toFixed(0)} mph, ${p.pressure} mb`
  ).join('\n')

  const systemPrompt = `You are a meteorological expert specializing in tropical cyclones.
You analyze storm tracking data and provide detailed, educational descriptions.
Always respond with valid JSON only, no additional text or explanations outside the JSON.
IMPORTANT: You must return exactly ${storm.points.length} points in your response.`

  const userPrompt = `Analyze the following storm tracking data for ${storm.name} (${storm.points.length} total tracking points):

STORM TRACKING POINTS:
${pointsSummary}

INSTRUCTIONS:
1. Provide a detailed 2-3 sentence description for EACH AND EVERY tracking point
2. Create an interesting, educational fun fact for each point
3. For milestone points (formation, peak intensity, landfall, dissipation), make the description more detailed

CRITICAL: You MUST return exactly ${storm.points.length} points in the JSON array, one for each tracking point listed above.

Return ONLY a valid JSON object:
{
  "points": [
    {
      "name": "Descriptive milestone name",
      "description": "2-3 sentences describing what happened",
      "funFact": "Interesting educational fact"
    }
  ]
}`

  try {
    const response = await callGroq([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], true)

    const parsedData = JSON.parse(extractJSON(response))

    if (!parsedData.points || parsedData.points.length === 0) {
      throw new Error('AI returned no points')
    }

    const enhancedPoints = storm.points.map((point, index) => ({
      ...point,
      name: parsedData.points[index]?.name || point.name,
      description: parsedData.points[index]?.description || '',
      funFact: parsedData.points[index]?.funFact || ''
    }))

    return {
      ...storm,
      points: enhancedPoints
    }
  } catch (error) {
    console.error('Error enhancing storm with AI:', error)
    return storm
  }
}

/**
 * Get a list of available storm names from both files (for debugging/suggestions)
 */
export async function getAvailableStorms(): Promise<{ name: string; year: string; source: string }[]> {
  const storms: { name: string; year: string; source: string }[] = []
  
  try {
    const csvResponse = await fetch('/IBTrACS_last3years_1bcb_f875_aa83.csv')
    const csvText = await csvResponse.text()
    const lines = csvText.split('\n').filter(line => line.trim())
    
    const csvStorms = new Set<string>()
    for (let i = 2; i < lines.length; i++) {
      const values = lines[i].split(',')
      if (values.length >= 5) {
        const name = values[4]?.toUpperCase().trim()
        const year = values[2]?.trim()
        if (name && year) {
          const stormKey = `${name}-${year}`
          if (!csvStorms.has(stormKey)) {
            csvStorms.add(stormKey)
            storms.push({ name, year, source: 'IBTrACS' })
          }
        }
      }
    }
  } catch (error) {
    console.error('Error getting CSV storms:', error)
  }
  
  try {
    const bstResponse = await fetch('/bst_all.txt')
    const bstText = await bstResponse.text()
    const lines = bstText.split('\n').filter(line => line.trim())
    
    for (const line of lines) {
      if (line.startsWith('66666')) {
        const parts = line.trim().split(/\s+/)
        const dateStr = parts[parts.length - 1]
        const year = dateStr.substring(0, 4)
        
        if (parts.length >= 8 && parts[7].length > 4) {
          const name = parts[7].toUpperCase().trim()
          const exists = storms.some(s => s.name === name && s.year === year)
          if (!exists) {
            storms.push({ name, year, source: 'BST' })
          }
        }
      }
    }
  } catch (error) {
    console.error('Error getting BST storms:', error)
  }
  
  return storms.sort((a, b) => b.year.localeCompare(a.year)).slice(0, 100)
}

export async function searchStormWithAI(query: string): Promise<Storm | null> {
  const queryParts = query.trim().split(/\s+/)
  const stormName = queryParts[0]
  const stormYear = queryParts[1] || ''

  if (!stormName) {
    throw new Error('Please provide a storm name')
  }

  let storm: Storm | null = null

  // Step 1: Try IBTrACS CSV first
  try {
    const csvData = await searchIBTrACSCSV(stormName, stormYear)
    if (csvData) {
      // Filter to only include points with real data (wind OR pressure)
      const pointsWithData = csvData.points.filter(p => p.hasRealWind || p.hasRealPressure)

      if (pointsWithData.length > 0) {
        // Create storm with only points that have data
        const filteredData: CSVStormData = {
          ...csvData,
          points: pointsWithData
        }
        storm = createStormFromCSVData(filteredData)
        console.log(`Using IBTrACS: ${pointsWithData.length}/${csvData.points.length} points with data`)
      }
    }
  } catch (error) {
    console.error('Error searching IBTrACS CSV:', error)
  }

  // Step 2: Try BST file for map display (only if IBTrACS not found or no data)
  if (!storm) {
    try {
      const bstData = await searchBSTFile(stormName, stormYear)
      if (bstData) {
        storm = createStormFromBSTData(bstData)
        console.log('Using BST file for storm data')
      }
    } catch (error) {
      console.error('Error searching BST file:', error)
    }
  }

  if (!storm) {
    throw new Error(
      `Could not find storm "${stormName}"${stormYear ? ` in ${stormYear}` : ''}. ` +
      `Please check the storm name and year.`
    )
  }

  // Enhance with AI descriptions
  return await enhanceStormWithAI(storm)
}
