<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto px-4 pb-32">
      <div class="flex items-center gap-3 mb-6">
        <h1 class="font-semibold text-xl text-gray-800">Lokasi Kegiatan</h1>
      </div>

      <div class="space-y-5">
        <div class="flex flex-col gap-2">
          <label for="titik-lokasi" class="text-gray-700 text-sm font-medium">
            Titik Lokasi <span class="text-red-500">*</span>
          </label>
          <Button
            label="Pilih Titik Lokasi"
            icon="pi pi-map-marker"
            outlined
            class="w-full justify-start"
            @click="showMapDialog = true"
          />
          <div v-if="selectedLocation" class="mt-2 p-3 bg-gray-50 rounded-lg">
            <div class="flex items-start gap-2">
              <i class="pi pi-map-marker text-primary-500 mt-1"></i>
              <div class="flex-1">
                <p class="font-medium text-sm text-gray-800">
                  {{ selectedLocation.namaLokasi || 'Lokasi dipilih' }}
                </p>
                <p v-if="selectedLocation.address" class="text-xs text-gray-600 mt-1">
                  {{ selectedLocation.address }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  Lat: {{ selectedLocation.lat?.toFixed(6) }}, Lng: {{ selectedLocation.lng?.toFixed(6) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="informasi-lokasi" class="text-gray-700 text-sm font-medium">
            Informasi Lokasi <span class="text-red-500">*</span>
          </label>
          <Message size="small" severity="secondary" variant="simple">
            Jelaskan informasi detail tentang lokasi kegiatan
          </Message>
          <Textarea
            id="informasi-lokasi"
            v-model="formData.nama_lokasi"
            placeholder="Contoh: Gedung serbaguna, dekat dengan pasar"
            rows="4"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="alamat" class="text-gray-700 text-sm font-medium">
            Alamat <span class="text-red-500">*</span>
          </label>
          <Textarea
            id="alamat"
            v-model="formData.alamat"
            placeholder="Masukkan alamat lengkap lokasi kegiatan"
            rows="4"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 border-t border-gray-200 shadow-lg z-50 max-w-md mx-auto">
      <Button
        label="Selanjutnya"
        @click="handleNext"
        class="w-full"
        rounded
      />
    </div>

    <Dialog
      v-model:visible="showMapDialog"
      modal
      header="Pilih Titik Lokasi"
      :style="{ width: '95%', maxWidth: '500px' }"
      :closable="true"
      @show="onMapDialogShow"
    >
      <div class="h-[400px] w-full relative">
        <ClientOnly>
          <MapLeaflet
            v-if="showMapDialog"
            :lat="mapLat"
            :lng="mapLng"
            :selectable="true"
            @location-selected="onLocationSelected"
          />
        </ClientOnly>
      </div>

      <div v-if="tempLocation" class="mt-4 p-3 bg-gray-50 rounded-lg">
        <div v-if="reverseGeocodingLoading" class="flex items-center gap-2">
          <ProgressSpinner style="width: 20px; height: 20px" />
          <p class="text-sm text-gray-600">Mengambil alamat...</p>
        </div>
        <div v-else class="flex items-start gap-2">
          <i class="pi pi-map-marker text-primary-500 mt-1"></i>
          <div class="flex-1">
            <p class="font-medium text-sm">
              {{
                tempLocation.namaLokasi ||
                tempLocation.address ||
                "Lokasi dipilih"
              }}
            </p>
            <p v-if="tempLocation.address" class="text-xs text-gray-600 mt-1">
              {{ tempLocation.address }}
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="Batal"
          severity="secondary"
          outlined
          @click="showMapDialog = false"
        />
        <Button label="Simpan Lokasi" @click="saveLocation" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProposalForm } from '@/composables/useProposalForm'

const router = useRouter()
const { formData } = useProposalForm()

const showMapDialog = ref(false);
const mapLat = ref(-6.5641311);
const mapLng = ref(106.6438673);
const selectedLocation = ref(null);
const tempLocation = ref(null);
const reverseGeocodingLoading = ref(false);


const onMapDialogShow = () => {
  if (selectedLocation.value) {
    mapLat.value = selectedLocation.value.lat
    mapLng.value = selectedLocation.value.lng
  }
}

const onLocationSelected = async (location) => {
  tempLocation.value = {
    lat: location.lat,
    lng: location.lng,
    namaLokasi: null,
    address: null
  }

  reverseGeocodingLoading.value = true
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
    )
    const data = await response.json()
    if (data && data.display_name) {
      const addressParts = data.display_name.split(',')
      tempLocation.value.namaLokasi = addressParts[0]?.trim() || `Lokasi (${location.lat.toFixed(6)}, ${location.lng.toFixed(6)})`
      tempLocation.value.address = data.display_name
    } else {
      tempLocation.value.address = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
      tempLocation.value.namaLokasi = `Lokasi (${location.lat.toFixed(6)}, ${location.lng.toFixed(6)})`
    }
  } catch (error) {
    tempLocation.value.address = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
    tempLocation.value.namaLokasi = `Lokasi (${location.lat.toFixed(6)}, ${location.lng.toFixed(6)})`
  } finally {
    reverseGeocodingLoading.value = false
  }
}

const saveLocation = () => {
  if (tempLocation.value) {
    selectedLocation.value = { ...tempLocation.value }
    formData.value.latitude = tempLocation.value.lat
    formData.value.longitude = tempLocation.value.lng
    if (tempLocation.value.namaLokasi) {
      formData.value.nama_lokasi = tempLocation.value.namaLokasi
    }
    showMapDialog.value = false
  }
}

const goBack = () => {
  router.back()
}

const handleNext = () => {
  if (!formData.value.latitude || !formData.value.longitude || !formData.value.nama_lokasi || !formData.value.alamat) {
    return
  }

  router.push('/services/proposal/buat/banner')
}

onMounted(() => {
})

definePageMeta({
  layout: "complaint-layout",
});
</script>
