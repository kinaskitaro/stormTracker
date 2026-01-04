export interface StormPoint {
  id: string
  name: string
  lat: number
  lng: number
  category: number // -1: Tropical Depression, 0: Tropical Storm, 1-5: Hurricane Categories
  windSpeed: number
  pressure: number
  description: string
  funFact: string
  timestamp: string
}

export interface Storm {
  id: string
  name: string
  points: StormPoint[]
  color: string
  emoji: string
}
