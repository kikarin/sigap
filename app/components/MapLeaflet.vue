<template>
  <div ref="mapContainer"  class="w-full h-56" ></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'

const mapContainer = ref(null)
let map = null

onMounted(() => {
  // 1. Inisialisasi Peta
  // Kita pasang ke elemen DOM dari ref 'mapContainer'
  map = L.map(mapContainer.value).setView([-6.5737827,106.6442084], 13)

  // 2. Tambahkan Tile Layer (OSM)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  // 3. Tambahkan Marker Manual
  const marker = L.marker([-6.5737827,106.6442084]).addTo(map)

})

// PENTING: Hapus instance peta saat komponen di-destroy agar tidak memori leak
onUnmounted(() => {
  if (map) {
    map.remove()
  }
})
</script>   