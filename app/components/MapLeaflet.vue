<template>
  <div ref="mapContainer" class="w-full h-full"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'

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

const emit = defineEmits(['location-selected', 'current-location'])

const mapContainer = ref(null)
let map = null
let marker = null
let L = null
let redIcon = null

// Load Leaflet only on client-side
const loadLeaflet = async () => {
  if (import.meta.client && typeof window !== 'undefined') {
    const leafletModule = await import('leaflet')
    L = leafletModule.default || leafletModule
    redIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
    return L
  }
  return null
}

const setupClickHandler = () => {
  if (!map || !L) return
  
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

const initMap = async () => {
  if (!mapContainer.value || map || !import.meta.client) return

  // Load Leaflet first
  const Leaflet = await loadLeaflet()
  if (!Leaflet) return

  L = Leaflet

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
  if (import.meta.client) {
    initMap()
  }
})

// Watch untuk update selectable
watch(() => props.selectable, (newSelectable) => {
  setupClickHandler()
}, { immediate: false })

// Watch untuk update marker jika props berubah
watch(() => [props.lat, props.lng, props.zoom], ([newLat, newLng, newZoom]) => {
  if (map && L) {
    if (marker) {
      marker.setLatLng([newLat, newLng])
    } else {
      marker = L.marker([newLat, newLng], { icon: redIcon, draggable: false }).addTo(map)
    }
    map.setView([newLat, newLng], newZoom)
  }
})

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!import.meta.client || typeof window === 'undefined' || !navigator.geolocation) {
      const error = { error: 'Geolocation tidak didukung oleh browser Anda' }
      emit('current-location', error)
      reject(error)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // Update map view ke lokasi user
        if (map && L) {
          map.setView([latitude, longitude], 15)
          
          // Update marker
          if (marker) {
            map.removeLayer(marker)
            marker = null
          }
          marker = L.marker([latitude, longitude], { icon: redIcon, draggable: false }).addTo(map)
          
          // Emit event
          emit('location-selected', { lat: latitude, lng: longitude })
          emit('current-location', { lat: latitude, lng: longitude })
        }
        
        resolve({ lat: latitude, lng: longitude })
      },
      (error) => {
        const errorMsg = {
          error: 'Gagal mendapatkan lokasi. Pastikan izin lokasi sudah diberikan.'
        }
        emit('current-location', errorMsg)
        reject(errorMsg)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  })
}

// Expose method ke parent
defineExpose({
  getCurrentLocation
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
