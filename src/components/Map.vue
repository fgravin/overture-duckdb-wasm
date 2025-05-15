<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { addGeoJsonLayerAndReturnLegend } from '../services/layer'
import { useAppStore } from '@/store/app.store.ts'

onMounted(async () => {
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    center: [-111.932831, 40.694175],
    zoom: 7,
    bearing: 0,
  })
  map.addControl(new maplibregl.NavigationControl())

  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
  })
  map.on('mousemove', 'places-area', (e) => {
    map.getCanvas().style.cursor = 'pointer'
    const description = `
      <div class="text-lg">
          <div class="font-bold">${e.features[0].properties.name}</div>
          <div>${e.features[0].properties.count}</div>
      </div>
    `
    popup.setLngLat(e.lngLat).setHTML(description).addTo(map)
  })
  map.on('mouseleave', 'places-area', () => {
    map.getCanvas().style.cursor = ''
    popup.remove()
  })

  const store = useAppStore()
  const { query } = storeToRefs(store)
  watchEffect(async () => {
    if (!query.value) return
    const legend = await addGeoJsonLayerAndReturnLegend(map, query.value)
    if (legend) {
      store.setLegend(legend)
    } else {
      store.setQueryError(true)
    }
    store.setQueryLoading(false)
  })
})
</script>

<template>
  <div id="map" class="h-full w-full"></div>
</template>

<style scoped></style>
