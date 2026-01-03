<template>
  <div class="p-4 flex flex-col h-full">
    <div class="flex-1">
      <DynamicHeader title="Lokasi Kegiatan" />
      <div class="mt-10 space-y-5">
        <div class="flex flex-col gap-2">
          <label for="titik-lokasi" class="text-gray-700 text-md">
            Titik Lokasi <span class="text-red-500">*</span>
          </label>
          <Button
            label="Pilih Titik Lokasi"
            icon="pi pi-map-marker"
            outlined
            class="w-full justify-start"
            @click="showMapDialog = true"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="deskripsi">Deskripsi Kegiatan</label>
          <Message size="small" severity="secondary" variant="simple"
            >Jelaskan secara detail kegiatan yang akan dilakukan</Message
          >
          <Textarea
            id="deskripsi"
            v-model="value"
            placeholder=""
            rows="5"
            cols=""
          />
        </div>
      </div>
    </div>
    <button
      class="w-full rounded-full  text-white font-bold bg-primary-500 p-3 mt-5 hover:bg-primary-600 transition-colors"
    >
      Simpan
    </button>
  </div>
  <Dialog
    v-model:visible="showMapDialog"
    modal
    header="Titik Lokasi"
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
</template>

<script setup>
import { ref } from "vue";

const showMapDialog = ref(false);
</script>
