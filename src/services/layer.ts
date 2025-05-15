import { Map } from 'maplibre-gl'
import { executeQuery } from './duckdb'
import type { Feature } from 'geojson'

export const colors = ['#d3f2a3', '#97e196', '#6cc08b', '#4c9b82', '#217a79', '#105965', '#074050']

export async function addGeoJsonLayerAndReturnLegend(map: Map, query = '') {
  const data = await executeQuery(query)

  if (!data) return

  const counts = data.features.map((f: Feature) => f.properties.count)
  const max = Math.max(...counts)
  const min = Math.min(...counts)
  const nbClasses = colors.length

  const logMin = Math.log10(Math.max(min, 1))
  const logMax = Math.log10(max)
  const interval = (logMax - logMin) / nbClasses

  const colorGradient = colors
    .map((color, i) => [Math.pow(10, logMin + interval * i), color])
    .flat()
  if (colorGradient[0] === 1) {
    colorGradient[0] = 0
  }

  if (map.getLayer('places-area')) {
    map.removeLayer('places-area')
    map.removeSource('places-area-sources')
  }
  map.addSource('places-area-sources', {
    type: 'geojson',
    data,
  })
  map.addLayer({
    id: 'places-area',
    type: 'fill',
    source: 'places-area-sources',
    paint: {
      'fill-color': ['interpolate', ['linear'], ['get', 'count'], ...colorGradient],
      'fill-outline-color': 'grey',
      'fill-opacity': 0.8,
    },
  })

  return colorGradient
}
