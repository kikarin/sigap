<template>
  <div class="flex justify-between h-full flex-col">
    <div class="space-y-5 flex-1 overflow-y-auto pb-14">
      <h1 class="font-semibold text-xl">Lokasi Aduan</h1>
      <div class="flex flex-col gap-4">
        <!-- Titik Lokasi -->
        <div class="flex flex-col gap-2">
          <label for="titik-lokasi" class="text-gray-700 text-sm">
            Titik Lokasi <span class="text-red-500">*</span>
          </label>
          <Button
            label="Pilih Titik Lokasi"
            icon="pi pi-map-marker"
            outlined
            class="w-full justify-start border-dashed"
            @click="showMapDialog = true"
          />
        </div>

        <!-- Deskripsi Lokasi Tambahan -->
        <div class="flex flex-col gap-2">
          <label for="deskripsi-lokasi" class="text-gray-700 text-sm">
            Deskripsi Lokasi Tambahan <span class="text-red-500">*</span>
          </label>
          <Textarea
            id="deskripsi-lokasi"
            v-model="deskripsiLokasi"
            rows="4"
            autoResize
            placeholder="Masukan deskripsi lokasi"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- Footer Navigation -->
    <div class="flex items-center gap-3">
      <button
        @click="goBack"
        class="inline-flex p-4 hover:cursor-pointer shrink-0 rounded-full border items-center justify-center border-gray-300 shadow-xl hover:bg-gray-50 transition-colors"
      >
        <i class="pi pi-arrow-left text-xl leading-none"></i>
      </button>
      <NuxtLink to="/services/aduan/complaint/verification" class="w-full">
        <Button
          label="Selanjutnya"
          class="w-full text-white font-semibold rounded-full shadow-lg transition-colors"
          rounded
          size="large"
        />
      </NuxtLink>
    </div>
  </div>

  <!-- Map Dialog -->
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
import { ref,  watch } from "vue";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast();
const { formData, resetForm } = useAduanForm();
const { createAduan } = useAduan();

// Location state
const showMapDialog = ref(false);
const mapLat = ref(formData.value.latitude || -6.5641311);
const mapLng = ref(formData.value.longitude || 106.6438673);
const selectedLocation = ref(null);
const tempLocation = ref(null);
const reverseGeocodingLoading = ref(false);
const deskripsiLokasi = ref(formData.value.deskripsi_lokasi || "");
const loading = ref(false);

// Reverse geocoding function
const reverseGeocode = async (lat, lng) => {
  reverseGeocodingLoading.value = true;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=id`,
      {
        headers: {
          "User-Agent": "SIGAP-Desa-Digital/1.0",
        },
      }
    );

    if (!response.ok) throw new Error("Reverse geocode failed");
    const data = await response.json();

    if (data) {
      const address = data.address || {};
      const road = address.road || "";
      const village = address.village || address.suburb || "";
      const district = address.district || address.city_district || "";
      const city = address.city || address.county || "";

      // Gabungkan bagian address
      const addressParts = [road, village, district, city].filter(Boolean);
      const fullAddress = addressParts.join(", ") || data.display_name;

      // Auto-fill form
      deskripsiLokasi.value = fullAddress;
      formData.value.deskripsi_lokasi = fullAddress;

      // Nama lokasi = bagian pertama (nama jalan) atau koordinat
      const addressPartsArray = fullAddress.split(",");
      const namaLokasi =
        addressPartsArray[0]?.trim() ||
        `Lokasi Aduan (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
      formData.value.nama_lokasi = namaLokasi;

      return {
        lat,
        lng,
        address: fullAddress,
        namaLokasi,
      };
    }
  } catch (error) {
    // Fallback jika reverse geocoding gagal
    const namaLokasi = `Lokasi Aduan (${lat.toFixed(6)}, ${lng.toFixed(6)})`;
    formData.value.nama_lokasi = namaLokasi;
    deskripsiLokasi.value = "";
    formData.value.deskripsi_lokasi = "";

    return {
      lat,
      lng,
      address: namaLokasi,
      namaLokasi,
    };
  } finally {
    reverseGeocodingLoading.value = false;
  }
};

watch(deskripsiLokasi, (newVal) => {
  formData.value.deskripsi_lokasi = newVal;
});

watch(
  () => selectedLocation.value,
  (newVal) => {
    if (newVal) {
      formData.value.latitude = newVal.lat;
      formData.value.longitude = newVal.lng;
      if (newVal.address) {
        formData.value.nama_lokasi = newVal.namaLokasi || newVal.address;
        deskripsiLokasi.value = newVal.address;
      }
    }
  }
);

const onLocationSelected = async (location) => {
  mapLat.value = location.lat;
  mapLng.value = location.lng;

  const geocodeResult = await reverseGeocode(location.lat, location.lng);

  tempLocation.value = {
    lat: geocodeResult.lat,
    lng: geocodeResult.lng,
    address: geocodeResult.address,
    namaLokasi: geocodeResult.namaLokasi,
  };
};

const saveLocation = () => {
  if (tempLocation.value) {
    selectedLocation.value = tempLocation.value;
    showMapDialog.value = false;
  }
};

const onMapDialogShow = async () => {
  if (mapLat.value && mapLng.value) {
    const geocodeResult = await reverseGeocode(mapLat.value, mapLng.value);
    tempLocation.value = {
      lat: geocodeResult.lat,
      lng: geocodeResult.lng,
      address: geocodeResult.address,
      namaLokasi: geocodeResult.namaLokasi,
    };
  } else {
    tempLocation.value = {
      lat: mapLat.value,
      lng: mapLng.value,
      address: "",
      namaLokasi: "",
    };
  }
};

const goBack = () => {
  router.back();
};

const handleSubmit = async () => {
  if (!formData.value.kategori_aduan_id) {
    toast.add({
      severity: "warn",
      summary: "Peringatan",
      detail: "Mohon pilih kategori aduan",
      life: 3000,
    });
    return
  }

  if (!formData.value.judul || !formData.value.detail_aduan) {
    toast.add({
      severity: "warn",
      summary: "Peringatan",
      detail: "Mohon lengkapi judul dan deskripsi aduan",
      life: 3000,
    });
    return
  }

  if (!formData.value.latitude || !formData.value.longitude) {
    toast.add({
      severity: "warn",
      summary: "Peringatan",
      detail: "Mohon pilih titik lokasi",
      life: 3000,
    });
    return
  }

  if (!formData.value.deskripsi_lokasi) {
    toast.add({
      severity: "warn",
      summary: "Peringatan",
      detail: "Mohon isi deskripsi lokasi",
      life: 3000,
    });
    return
  }

  loading.value = true

  try {
    const response = await createAduan({
      kategori_aduan_id: formData.value.kategori_aduan_id,
      judul: formData.value.judul,
      detail_aduan: formData.value.detail_aduan,
      latitude: formData.value.latitude,
      longitude: formData.value.longitude,
      nama_lokasi: formData.value.nama_lokasi,
      deskripsi_lokasi: formData.value.deskripsi_lokasi,
      jenis_aduan: formData.value.jenis_aduan || 'publik',
      alasan_melaporkan: formData.value.alasan_melaporkan || '',
      files: formData.value.files || []
    })

    if (response.success) {
      toast.add({
        severity: "success",
        summary: "Berhasil",
        detail: response.message || "Aduan berhasil dikirim",
        life: 3000,
      });
      
      resetForm()
      
      setTimeout(() => {
        router.push('/services/complaint/masyarakat')
      }, 1500)
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Terjadi kesalahan saat mengirim aduan'
    const errors = (err.response && err.response.errors) || null

    toast.add({
      severity: "error",
      summary: "Gagal",
      detail: errors ? Object.values(errors).flat().join(', ') : errorMessage,
      life: 5000,
    });
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: "complaint-layout",
});
</script>
