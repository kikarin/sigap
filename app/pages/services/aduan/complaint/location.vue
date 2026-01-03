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
        
        <!-- Kecamatan -->
        <div class="flex flex-col gap-2">
          <label for="kecamatan" class="text-gray-700 text-sm">
            Kecamatan <span class="text-red-500">*</span>
          </label>
          <Select
            id="kecamatan"
            v-model="selectedKecamatan"
            :options="kecamatanList"
            optionLabel="name"
            placeholder="Pilih kecamatan"
            class="w-full"
            :loading="loadingKecamatan"
            @change="onKecamatanChange"
          />
        </div>

        <!-- Kelurahan/Desa -->
        <div class="flex flex-col gap-2">
          <label for="kelurahan" class="text-gray-700 text-sm">
            Kelurahan/Desa <span class="text-red-500">*</span>
          </label>
          <Select
            id="kelurahan"
            v-model="selectedKelurahan"
            :options="kelurahanList"
            optionLabel="name"
            placeholder="Pilih kelurahan/desa"
            class="w-full"
            :disabled="!selectedKecamatan || loadingKelurahan"
            :loading="loadingKelurahan"
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
import { ref, computed, watch, onMounted } from "vue";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast();
const { formData } = useAduanForm();
const { getKecamatan, getDesa } = useAduan();

// Location state
const showMapDialog = ref(false);
const mapLat = ref(formData.value.latitude || -6.5641311);
const mapLng = ref(formData.value.longitude || 106.6438673);
const selectedLocation = ref(null);
const tempLocation = ref(null);
const reverseGeocodingLoading = ref(false);

// Form state
const kecamatanList = ref([
  { id: 1, name: "Kecamatan A" },
  { id: 2, name: "Kecamatan B" },
  { id: 3, name: "Kecamatan C" },
]);
const kelurahanList = ref([
  { id: 1, kecamatanId: 1, name: "Kelurahan A1" },
  { id: 2, kecamatanId: 1, name: "Kelurahan A2" },
  { id: 3, kecamatanId: 2, name: "Kelurahan B1" },
  { id: 4, kecamatanId: 2, name: "Kelurahan B2" },
  { id: 5, kecamatanId: 3, name: "Kelurahan C1" },
]);

const selectedKecamatan = ref(null);
const selectedKelurahan = ref(null);
const deskripsiLokasi = ref(formData.value.deskripsi_lokasi || "");
const loadingKecamatan = ref(false);
const loadingKelurahan = ref(false);

// Fetch kecamatan dari API
const fetchKecamatan = async () => {
  loadingKecamatan.value = true;
  try {
    const response = await getKecamatan();
    if (response.success && response.data) {
      // Transform data dari API format {value, label} ke format yang digunakan di UI
      kecamatanList.value = response.data.map((item) => ({
        id: item.value,
        name: item.label,
      }));

      // Set selected kecamatan jika sudah ada di formData
      if (formData.value.kecamatan_id) {
        selectedKecamatan.value =
          kecamatanList.value.find(
            (k) => k.id === formData.value.kecamatan_id
          ) || null;
        if (selectedKecamatan.value) {
          await fetchDesa(selectedKecamatan.value.id);
        }
      }
    }
  } catch (error) {
    const err = error || {};
    const errorMessage =
      (err.response && err.response.message) ||
      err.message ||
      "Gagal memuat kecamatan";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: errorMessage,
      life: 3000,
    });
  } finally {
    loadingKecamatan.value = false;
  }
};

// Fetch desa dari API
const fetchDesa = async (kecamatanId) => {
  if (!kecamatanId) return;

  loadingKelurahan.value = true;
  kelurahanList.value = [];
  selectedKelurahan.value = null;

  try {
    const response = await getDesa(kecamatanId);
    if (response.success && response.data) {
      // Transform data dari API format {value, label} ke format yang digunakan di UI
      kelurahanList.value = response.data.map((item) => ({
        id: item.value,
        name: item.label,
      }));

      // Set selected kelurahan jika sudah ada di formData
      if (formData.value.desa_id) {
        selectedKelurahan.value =
          kelurahanList.value.find((k) => k.id === formData.value.desa_id) ||
          null;
      }
    }
  } catch (error) {
    const err = error || {};
    const errorMessage =
      (err.response && err.response.message) ||
      err.message ||
      "Gagal memuat desa/kelurahan";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: errorMessage,
      life: 3000,
    });
  } finally {
    loadingKelurahan.value = false;
  }
};

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
    console.error("Reverse geocode error:", error);
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

// Watch dan simpan ke formData
watch(selectedKecamatan, async (newVal) => {
  if (newVal) {
    formData.value.kecamatan_id = newVal.id;
    await fetchDesa(newVal.id);
  } else {
    kelurahanList.value = [];
    selectedKelurahan.value = null;
    formData.value.kecamatan_id = null;
    formData.value.desa_id = null;
  }
});

watch(selectedKelurahan, (newVal) => {
  if (newVal) {
    formData.value.desa_id = newVal.id;
  } else {
    formData.value.desa_id = null;
  }
});

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

const onKecamatanChange = () => {
  selectedKelurahan.value = null;
  formData.value.desa_id = null;
};

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

onMounted(() => {
  fetchKecamatan();
});

definePageMeta({
  layout: "complaint-layout",
});
</script>
