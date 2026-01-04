<template>
  <div class="h-[calc(100vh-80px)] flex flex-col bg-white">
    <div class="px-4 py-4 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <Button
          icon="pi pi-arrow-left"
          text
          rounded
          @click="goBack"
        />
        <h1 class="font-semibold text-lg text-gray-800">Lokasi Layanan Darurat</h1>
      </div>
    </div>

    <div class="flex-1 relative min-h-0" style="min-height: 300px;">
      <ClientOnly>
        <template #default>
          <div ref="mapContainer" class="w-full h-full" style="min-height: 300px;"></div>
        </template>
        <template #fallback>
          <div class="w-full h-full flex items-center justify-center bg-gray-100">
            <p class="text-gray-500">Memuat peta...</p>
          </div>
        </template>
      </ClientOnly>
    </div>

    <div class="px-4 py-3 border-t border-gray-200 bg-white flex-shrink-0">
      <div class="flex gap-2">
        <Button
          v-for="filter in filters"
          :key="filter.id"
          :label="filter.label"
          @click="selectedFilter = filter.id"
          :severity="selectedFilter === filter.id ? undefined : 'secondary'"
          :outlined="selectedFilter !== filter.id"
          class="flex-1"
          rounded
          size="small"
        />
      </div>
    </div>

    <div class="h-64 overflow-y-auto bg-white border-t border-gray-200 flex-shrink-0">
      <div class="px-4 py-3">
        <div
          v-for="location in filteredLocations"
          :key="location.id"
          @click="selectLocation(location)"
          class="flex items-start gap-3 p-3 rounded-lg mb-2 cursor-pointer transition-all hover:bg-gray-50 active:scale-[0.98]"
          :class="selectedLocationId === location.id ? 'bg-blue-50 border border-blue-200' : 'border border-gray-100'"
        >
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
          >
            <NuxtImg
              :src="getLocationIcon(location.kategori)"
              :alt="location.kategori"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-sm text-gray-800 mb-1">{{ location.name }}</h3>
            <p class="text-xs text-gray-600 leading-relaxed">{{ location.address }}</p>
          </div>
          <a
            v-if="location.phone"
            @click.stop
            :href="getWhatsAppLink(location.phone)"
            target="_blank"
            class="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            <i class="pi pi-whatsapp text-white text-lg"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Button } from 'primevue'
import L from 'leaflet'

const router = useRouter()
const toast = useToast()
const { getKategoriLayananDarurat, getListLayananDarurat } = useEmergencyLocation()

const filters = ref([])
const selectedFilter = ref(null)
const selectedLocationId = ref(null)
const mapContainer = ref(null)
const locations = ref([])
const loading = ref(false)
let map = null
let markers = []

const mapKategoriToType = (kategori) => {
  if (kategori === 'polsek') return 'police'
  if (kategori === 'puskesmas' || kategori === 'rumah_sakit') return 'hospital'
  if (kategori === 'pemadam_kebakaran') return 'fire'
  return 'hospital'
}

const fetchKategori = async () => {
  try {
    const response = await getKategoriLayananDarurat()
    if (response.success && response.data) {
      filters.value = response.data.map(item => ({
        id: item.value,
        label: item.label,
        type: mapKategoriToType(item.value)
      }))
      
      if (filters.value.length > 0 && !selectedFilter.value) {
        selectedFilter.value = filters.value[0].id
      }
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat kategori'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 3000
    })
  }
}

const fetchLayananDarurat = async (kategori = null) => {
  loading.value = true
  try {
    const params = {
      per_page: -1
    }
    
    if (kategori) {
      params.kategori = kategori
    }
    
    const response = await getListLayananDarurat(params)
    if (response.success && response.data) {
    locations.value = response.data.map(item => ({
      id: item.id,
      name: item.title,
      address: item.alamat,
      kategori: item.kategori,
      type: mapKategoriToType(item.kategori),
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude),
      phone: item.nomor_whatsapp
    }))
      
      updateMarkers()
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat layanan darurat'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const filteredLocations = computed(() => {
  if (!selectedFilter.value) return locations.value
  const filter = filters.value.find(f => f.id === selectedFilter.value)
  if (!filter) return locations.value
  return locations.value.filter(loc => loc.type === filter.type)
})

const getLocationIcon = (kategori) => {
  if (kategori === 'rumah_sakit') return '/icons/hospital.png'
  if (kategori === 'puskesmas') return '/icons/hospital.png'
  if (kategori === 'polsek') return '/icons/police-car.png'
  if (kategori === 'pemadam_kebakaran') return '/icons/firefighter.png'
  return '/icons/marker.png'
}

const getLocationIconClass = (kategori) => {
  if (kategori === 'rumah_sakit') return 'bg-green-500'
  if (kategori === 'puskesmas') return 'bg-emerald-500'
  if (kategori === 'polsek') return 'bg-blue-500'
  if (kategori === 'pemadam_kebakaran') return 'bg-red-500'
  return 'bg-gray-500'
}

const getMarkerIcon = (kategori) => {
  let color = 'green'
  if (kategori === 'rumah_sakit') color = 'green'
  else if (kategori === 'puskesmas') color = 'green'
  else if (kategori === 'polsek') color = 'blue'
  else if (kategori === 'pemadam_kebakaran') color = 'red'
  
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
}

const getWhatsAppLink = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}`
}

const selectLocation = (location) => {
  selectedLocationId.value = location.id
  if (map) {
    map.setView([location.lat, location.lng], 15)
  }
}

const initMap = () => {
  if (!mapContainer.value || map) return

  map = L.map(mapContainer.value).setView([-6.5641311, 106.6438673], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  updateMarkers()

  nextTick(() => {
    setTimeout(() => {
      if (map) {
        map.invalidateSize()
      }
    }, 300)
  })
}

const updateMarkers = () => {
  if (!map) return

  markers.forEach(marker => {
    map.removeLayer(marker)
  })
  markers = []

  filteredLocations.value.forEach(location => {
    const icon = getMarkerIcon(location.kategori)
    const marker = L.marker([location.lat, location.lng], { icon })
      .addTo(map)
      .bindPopup(`<b>${location.name}</b><br>${location.address}`)
    
    marker.on('click', () => {
      selectLocation(location)
    })
    
    markers.push(marker)
  })

  if (filteredLocations.value.length > 0) {
    const bounds = L.latLngBounds(filteredLocations.value.map(loc => [loc.lat, loc.lng]))
    map.fitBounds(bounds, { padding: [50, 50] })
  }
}

watch(selectedFilter, (newVal) => {
  if (newVal) {
    fetchLayananDarurat(newVal)
  }
})

watch(mapContainer, (newVal) => {
  if (newVal && !map && import.meta.client) {
    nextTick(() => {
      setTimeout(() => {
        initMap()
      }, 200)
    })
  }
}, { immediate: true })

onMounted(async () => {
  await fetchKategori()
  
  if (selectedFilter.value) {
    await fetchLayananDarurat(selectedFilter.value)
  }
  
  if (import.meta.client) {
    nextTick(() => {
      setTimeout(() => {
        if (mapContainer.value && !map) {
          initMap()
        }
      }, 500)
    })
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
  markers = []
})

const goBack = () => {
  router.back()
}

definePageMeta({
  layout: 'default'
})
</script>

<style>
.leaflet-container {
  z-index: 0;
}
</style>

