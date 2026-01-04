import { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { Storm, StormPoint } from '../types'

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface StormMapProps {
  storm: Storm | null
  onPointClick?: (point: StormPoint) => void
}

export function StormMap({ storm, onPointClick }: StormMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const stormLayerRef = useRef<L.LayerGroup | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [25, -80],
      zoom: 5,
      zoomControl: true,
    })

    // Use CartoDB Positron tiles for clean, English-only map labels
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map)

    mapRef.current = map
    stormLayerRef.current = L.layerGroup().addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update map when storm changes
  useEffect(() => {
    if (!mapRef.current || !stormLayerRef.current) return

    const layerGroup = stormLayerRef.current
    layerGroup.clearLayers()

    if (!storm) {
      mapRef.current.setView([25, -80], 5)
      return
    }

    // Create storm path
    const latlngs = storm.points.map(p => [p.lat, p.lng] as [number, number])

    // Add the storm path line
    L.polyline(latlngs, {
      color: storm.color,
      weight: 4,
      opacity: 0.8,
      dashArray: '10, 10',
    }).addTo(layerGroup)

    // Add markers for each point
    storm.points.forEach((point, index) => {
      const categoryColor = getCategoryColor(point.category)

      // Create custom icon with category color
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: ${categoryColor};
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            color: white;
            font-weight: bold;
            font-size: 12px;
          ">${index + 1}</span>
        </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      })

      const marker = L.marker([point.lat, point.lng], { icon: customIcon })

      // Add popup
      const getCategoryLabel = (category: number): string => {
        if (category === -1) return 'Tropical Depression'
        if (category === 0) return 'Tropical Storm'
        if (category >= 1 && category <= 5) return `Category ${category}`
        return 'Unknown'
      }

      const popupContent = `
        <div style="text-align: center; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: ${storm.color};">${point.name}</h3>
          <div style="background: ${categoryColor}; color: white; display: inline-block; padding: 4px 12px; border-radius: 12px; font-weight: bold; margin-bottom: 8px;">
            ${getCategoryLabel(point.category)}
          </div>
          <p style="margin: 8px 0; color: #2C3E50;">${point.description}</p>
        </div>
      `

      marker.bindPopup(popupContent)

      marker.on('click', () => {
        if (onPointClick) {
          onPointClick(point)
        }
      })

      marker.addTo(layerGroup)
    })

    // Fit map to show entire storm path
    if (latlngs.length > 0) {
      mapRef.current.fitBounds(L.latLngBounds(latlngs), { padding: [50, 50] })
    }
  }, [storm, onPointClick])

  return (
    <div className="map-container">
      <div ref={mapContainerRef} className="storm-map" />
    </div>
  )
}

function getCategoryColor(category: number): string {
  const colors = {
    '-1': '#95A5A6', // Gray - Tropical Depression
    '0': '#6BCB77',  // Green - Tropical Storm
    '1': '#3498DB',  // Blue - Category 1
    '2': '#FFD93D',  // Yellow - Category 2
    '3': '#FF9F43',  // Orange - Category 3
    '4': '#FF6B6B',  // Red - Category 4
    '5': '#9B59B6',  // Purple - Category 5
  }
  return colors[category.toString() as keyof typeof colors] || '#6BCB77'
}
