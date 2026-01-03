<template>
  <div ref="mapContainer" class="w-full h-full"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import L from 'leaflet'

const props = defineProps({
  lat: {
    type: Number,
    default: -6.5641311
  },
  lng: {
    type: Number,
    default: 106.6438673
  },
  zoom: {
    type: Number,
    default: 13
  },
  selectable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['location-selected'])

const mapContainer = ref(null)
let map = null
let marker = null

const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const setupClickHandler = () => {
  if (!map) return
  
  // Hapus semua event click yang ada
  map.off('click')
  
  if (props.selectable) {
    map.on('click', (e) => {
      const { lat, lng } = e.latlng
      
      // Hapus marker lama jika ada
      if (marker) {
        map.removeLayer(marker)
        marker = null
      }
      
      // Tambahkan marker baru di lokasi yang diklik
      marker = L.marker([lat, lng], { icon: redIcon, draggable: false }).addTo(map)
      
      // Emit event dengan koordinat
      emit('location-selected', { lat, lng })
    })
    
    // Pastikan cursor menunjukkan bahwa map bisa diklik
    if (map.getContainer()) {
      map.getContainer().style.cursor = 'crosshair'
    }
  } else {
    if (map.getContainer()) {
      map.getContainer().style.cursor = 'default'
    }
  }
}

const initMap = () => {
  if (!mapContainer.value || map) return

  // Inisialisasi Peta
  map = L.map(mapContainer.value).setView([props.lat, props.lng], props.zoom)

  // Tambahkan Tile Layer (OSM)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  // Tambahkan Marker
  marker = L.marker([props.lat, props.lng], { icon: redIcon, draggable: false }).addTo(map)

  // Setup click handler
  setupClickHandler()

  // Invalidate size setelah map di-mount
  nextTick(() => {
    setTimeout(() => {
      if (map) {
        map.invalidateSize()
      }
    }, 300)
  })
}

onMounted(() => {
  initMap()
})

// Watch untuk update selectable
watch(() => props.selectable, (newSelectable) => {
  setupClickHandler()
}, { immediate: false })

// Watch untuk update marker jika props berubah
watch(() => [props.lat, props.lng, props.zoom], ([newLat, newLng, newZoom]) => {
  if (map) {
    if (marker) {
      marker.setLatLng([newLat, newLng])
    } else {
      marker = L.marker([newLat, newLng], { icon: redIcon, draggable: false }).addTo(map)
    }
    map.setView([newLat, newLng], newZoom)
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
  if (marker) {
    marker = null
  }
})
</script>   

<style>
.leaflet-container {
  z-index: 0;
}
</style>
