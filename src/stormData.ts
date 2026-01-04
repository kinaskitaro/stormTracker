import type { Storm } from './types'

export function calculateCategory(windSpeed: number): number {
  if (windSpeed < 39) return -1
  if (windSpeed < 74) return 0
  if (windSpeed < 96) return 1
  if (windSpeed < 111) return 2
  if (windSpeed < 130) return 3
  if (windSpeed < 157) return 4
  return 5
}

export const storms: Storm[] = [
  {
    id: 'katrina-2005',
    name: 'Hurricane Katrina',
    emoji: '🌀',
    color: '#FF6B6B',
    points: [
      {
        id: 'katrina-1',
        name: 'Formation',
        lat: 23.1,
        lng: -75.1,
        category: calculateCategory(75),
        windSpeed: 75,
        pressure: 999,
        description: 'Katrina formed as a tropical depression over the Bahamas.',
        funFact: 'Hurricanes need warm ocean water (at least 80°F) to form!',
        timestamp: '2005-08-23'
      },
      {
        id: 'katrina-2',
        name: 'Florida Landfall',
        lat: 25.5,
        lng: -80.5,
        category: calculateCategory(80),
        windSpeed: 80,
        pressure: 985,
        description: 'Katrina made its first landfall in Florida as a Category 1 hurricane.',
        funFact: 'Florida gets hit by hurricanes more than any other U.S. state!',
        timestamp: '2005-08-25'
      },
      {
        id: 'katrina-3',
        name: 'Gulf of Mexico',
        lat: 26.0,
        lng: -88.0,
        category: calculateCategory(115),
        windSpeed: 115,
        pressure: 965,
        description: 'Katrina strengthened to a Category 3 over the warm Gulf of Mexico waters.',
        funFact: 'The Gulf of Mexico is like hurricane fuel - its warm waters make storms stronger!',
        timestamp: '2005-08-27'
      },
      {
        id: 'katrina-4',
        name: 'Peak Intensity',
        lat: 27.5,
        lng: -89.0,
        category: calculateCategory(175),
        windSpeed: 175,
        pressure: 902,
        description: 'Katrina reached Category 5 status with winds of 175 mph!',
        funFact: 'Category 5 is the strongest hurricane level. Winds can blow over houses!',
        timestamp: '2005-08-28'
      },
      {
        id: 'katrina-5',
        name: 'Louisiana Landfall',
        lat: 30.0,
        lng: -89.5,
        category: calculateCategory(125),
        windSpeed: 125,
        pressure: 920,
        description: 'Katrina made its final landfall in Louisiana as a Category 3 hurricane.',
        funFact: 'The storm surge was 25-28 feet high - as tall as a 2-story building!',
        timestamp: '2005-08-29'
      }
    ]
  },
  {
    id: 'irma-2017',
    name: 'Hurricane Irma',
    emoji: '🌪️',
    color: '#4ECDC4',
    points: [
      {
        id: 'irma-1',
        name: 'Formation',
        lat: 16.4,
        lng: -30.2,
        category: calculateCategory(70),
        windSpeed: 70,
        pressure: 1005,
        description: 'Irma formed as a tropical storm off the coast of Africa.',
        funFact: 'Many Atlantic hurricanes start as "tropical waves" coming from Africa!',
        timestamp: '2017-08-27'
      },
      {
        id: 'irma-2',
        name: 'Rapid Intensification',
        lat: 18.5,
        lng: -40.0,
        category: calculateCategory(115),
        windSpeed: 115,
        pressure: 965,
        description: 'Irma rapidly intensified into a major hurricane.',
        funFact: '"Rapid intensification" means wind speeds increase by 35+ mph in 24 hours!',
        timestamp: '2017-08-30'
      },
      {
        id: 'irma-3',
        name: 'Category 5 Peak',
        lat: 18.0,
        lng: -55.0,
        category: calculateCategory(185),
        windSpeed: 185,
        pressure: 914,
        description: 'Irma became a Category 5 with 185 mph winds - the strongest Atlantic storm ever!',
        funFact: 'Irma maintained Category 5 status for 3 days - a new record!',
        timestamp: '2017-09-05'
      },
      {
        id: 'irma-4',
        name: 'Caribbean Islands',
        lat: 17.5,
        lng: -63.0,
        category: calculateCategory(185),
        windSpeed: 185,
        pressure: 916,
        description: 'Irma devastated several Caribbean islands including Barbuda and St. Martin.',
        funFact: 'On Barbuda, 95% of buildings were damaged. Everyone had to evacuate!',
        timestamp: '2017-09-06'
      },
      {
        id: 'irma-5',
        name: 'Cuba Landfall',
        lat: 21.5,
        lng: -77.0,
        category: calculateCategory(160),
        windSpeed: 160,
        pressure: 924,
        description: 'Irma hit northern Cuba as a Category 5 hurricane.',
        funFact: 'Cuba has mountains that can weaken hurricanes - but Irma stayed very strong!',
        timestamp: '2017-09-08'
      },
      {
        id: 'irma-6',
        name: 'Florida Landfall',
        lat: 24.5,
        lng: -81.5,
        category: calculateCategory(120),
        windSpeed: 120,
        pressure: 929,
        description: 'Irma made landfall in the Florida Keys.',
        funFact: 'The entire state of Florida was under a hurricane warning - over 20 million people!',
        timestamp: '2017-09-10'
      }
    ]
  },
  {
    id: 'maria-2017',
    name: 'Hurricane Maria',
    emoji: '⛈️',
    color: '#A855F7',
    points: [
      {
        id: 'maria-1',
        name: 'Formation',
        lat: 13.5,
        lng: -45.0,
        category: calculateCategory(75),
        windSpeed: 75,
        pressure: 1002,
        description: 'Maria formed as a tropical storm in the Atlantic.',
        funFact: '2017 was a very busy hurricane season - 17 named storms!',
        timestamp: '2017-09-16'
      },
      {
        id: 'maria-2',
        name: 'Rapid Strengthening',
        lat: 16.5,
        lng: -60.0,
        category: calculateCategory(160),
        windSpeed: 160,
        pressure: 925,
        description: 'Maria intensified from Category 1 to Category 5 in just 15 hours!',
        funFact: 'That is one of the fastest intensifications ever recorded!',
        timestamp: '2017-09-18'
      },
      {
        id: 'maria-3',
        name: 'Dominica Landfall',
        lat: 15.4,
        lng: -61.4,
        category: calculateCategory(165),
        windSpeed: 165,
        pressure: 915,
        description: 'Maria hit Dominica as a Category 5 hurricane.',
        funFact: 'The prime minister of Dominica said his island was "flattened".',
        timestamp: '2017-09-19'
      },
      {
        id: 'maria-4',
        name: 'Puerto Rico Landfall',
        lat: 18.3,
        lng: -66.2,
        category: calculateCategory(155),
        windSpeed: 155,
        pressure: 920,
        description: 'Maria made landfall in Puerto Rico as a Category 4 hurricane.',
        funFact: 'It was the strongest hurricane to hit Puerto Rico in 85 years!',
        timestamp: '2017-09-20'
      }
    ]
  },
  {
    id: 'ian-2022',
    name: 'Hurricane Ian',
    emoji: '🌊',
    color: '#3B82F6',
    points: [
      {
        id: 'ian-1',
        name: 'Formation',
        lat: 14.5,
        lng: -38.0,
        category: calculateCategory(70),
        windSpeed: 70,
        pressure: 1005,
        description: 'Ian formed as a tropical storm in the Caribbean.',
        funFact: 'Hurricane names repeat every 6 years unless the name is retired.',
        timestamp: '2022-09-23'
      },
      {
        id: 'ian-2',
        name: 'Cuba Crossing',
        lat: 22.0,
        lng: -84.0,
        category: calculateCategory(115),
        windSpeed: 115,
        pressure: 965,
        description: 'Ian crossed over Cuba as a Category 3 hurricane.',
        funFact: 'When hurricanes cross land, they usually weaken. But Ian stayed strong!',
        timestamp: '2022-09-27'
      },
      {
        id: 'ian-3',
        name: 'Florida Landfall',
        lat: 26.8,
        lng: -82.2,
        category: calculateCategory(150),
        windSpeed: 150,
        pressure: 940,
        description: 'Ian made landfall in southwest Florida as a Category 4 hurricane.',
        funFact: 'The storm surge reached 12-18 feet - taller than most houses!',
        timestamp: '2022-09-28'
      },
      {
        id: 'ian-4',
        name: 'Florida Exit',
        lat: 28.5,
        lng: -80.5,
        category: calculateCategory(75),
        windSpeed: 75,
        pressure: 980,
        description: 'Ian weakened to a tropical storm over Florida.',
        funFact: 'Even as a tropical storm, Ian dropped 20+ inches of rain in some areas!',
        timestamp: '2022-09-29'
      },
      {
        id: 'ian-5',
        name: 'South Carolina Landfall',
        lat: 33.5,
        lng: -79.0,
        category: calculateCategory(85),
        windSpeed: 85,
        pressure: 980,
        description: 'Ian made a second landfall in South Carolina.',
        funFact: 'Hurricanes can make landfall more than once if they stay over warm water!',
        timestamp: '2022-09-30'
      }
    ]
  }
]

export const getStormById = (id: string): Storm | undefined => {
  return storms.find(storm => storm.id === id)
}

export const searchStorms = (query: string): Storm[] => {
  const lowerQuery = query.toLowerCase()
  return storms.filter(storm =>
    storm.name.toLowerCase().includes(lowerQuery)
  )
}
