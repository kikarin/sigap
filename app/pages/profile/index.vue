<template>
  <div class="px-5">
    <div class="text-center p-4">
      <div class="w-full pt-10 items-center flex-col flex">
        <div class="rounded-full w-16 bg-blue-100 p-3">
          <i class="pi pi-user text-blue-500" style="font-size: 2.5rem"></i>
        </div>
        <div class="mt-5">
          <p class="text-base font-bold">
            {{ profileData?.nama || userData?.resident?.nama || userData?.name || 'User' }}
          </p>
          <p class="text-xs text-gray-500">{{ userData?.email || '' }}</p>
          <p v-if="profileData?.nik" class="text-xs text-gray-400 mt-1">NIK: {{ profileData.nik }}</p>
        </div>
      </div>
    </div>
    <div class="mt-10 space-y-5 pb-5">
      <Card class="border border-gray-200" v-if="profileData">
        <template #content>
          <div class="space-y-3">
            <div
              v-if="profileData.tempat_lahir || profileData.tanggal_lahir"
              class="flex flex-col gap-2"
            >
              <p class="text-xs text-gray-500">Tempat, Tanggal Lahir</p>
              <p class="text-sm">
                {{ profileData.tempat_lahir || '-' }},
                {{ profileData.tanggal_lahir || '-' }}
              </p>
            </div>

            <div v-if="profileData.jenis_kelamin" class="flex flex-col gap-2">
              <p class="text-xs text-gray-500">Jenis Kelamin</p>
              <p class="text-sm">{{ profileData.jenis_kelamin }}</p>
            </div>

            <div v-if="profileData.kartu_keluarga" class="flex flex-col gap-2">
              <p class="text-xs text-gray-500">Kartu Keluarga</p>
              <p class="text-sm">{{ profileData.kartu_keluarga }}</p>
            </div>

            <div v-if="profileData.family_status_text || profileData.family_status" class="flex flex-col gap-2">
              <p class="text-xs text-gray-500">Status Keluarga</p>
              <p class="text-sm">
                {{ profileData.family_status_text || profileData.family_status || '-' }}
              </p>
            </div>

            <div v-if="profileData.status_kawin_text || profileData.status_kawin" class="flex flex-col gap-2">
              <p class="text-xs text-gray-500">Status Perkawinan</p>
              <p class="text-sm">
                {{ profileData.status_kawin_text || profileData.status_kawin || '-' }}
              </p>
            </div>

            <div v-if="profileData.pendidikan" class="flex flex-col gap-2">
              <p class="text-xs text-gray-500">Pendidikan</p>
              <p class="text-sm">{{ profileData.pendidikan }}</p>
            </div>

            <div v-if="profileData.agama" class="flex flex-col gap-2">
              <p class="text-xs text-gray-500">Agama</p>
              <p class="text-sm">{{ profileData.agama }}</p>
            </div>

            <div v-if="profileData.pekerjaan" class="flex flex-col gap-2">
              <p class="text-xs text-gray-500">Pekerjaan</p>
              <p class="text-sm">{{ profileData.pekerjaan }}</p>
            </div>
          </div>
        </template>
      </Card>

      <!-- Menu Lainnya -->
      <Card class="border border-gray-200">
        <template #content>
          <div class="space-y-1">
            <button
              v-for="menu in menuItems"
              :key="menu.id"
              @click="handleMenuClick(menu)"
              class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                   :class="menu.bgColor || 'bg-gray-100'">
                <i :class="[menu.icon, menu.iconColor || 'text-gray-600']"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-gray-800">{{ menu.label }}</p>
                <p v-if="menu.description" class="text-xs text-gray-500 mt-0.5">{{ menu.description }}</p>
              </div>
              <i class="pi pi-angle-right text-gray-400 flex-shrink-0"></i>
            </button>
          </div>
        </template>
      </Card>

      <!-- Logout -->
      <Card class="border-gray-200 border">
        <template #content>
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            class="w-full"
            severity="danger"
            outlined
            @click="showLogoutDialog = true"
          />
        </template>
      </Card>

      <!-- Versi Aplikasi -->
      <div class="text-center py-4">
        <p class="text-xs text-gray-400">Versi 1.0.0</p>
      </div>
    </div>
  </div>

  <!-- Rumah Dialog -->
  <Dialog
    v-model:visible="showRumahDialog"
    modal
    header="Data Rumah"
    :style="{ width: '95%', maxWidth: '600px' }"
    :closable="true"
    @show="loadRumahData"
  >
    <div v-if="loadingRumah" class="flex justify-center items-center py-8">
      <ProgressSpinner />
    </div>

    <div v-else-if="rumahData" class="space-y-4">
      <!-- View Mode -->
      <div v-if="!isEditMode" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-gray-500">RT</label>
            <p class="text-sm font-medium">{{ rumahData.rt?.label || '-' }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500">Nomor Rumah</label>
            <p class="text-sm font-medium">{{ rumahData.nomor_rumah || '-' }}</p>
          </div>
        </div>

        <div>
          <label class="text-xs text-gray-500">Pemilik</label>
          <p class="text-sm font-medium">
            {{ rumahData.pemilik?.is_milik_anda 
              ? (rumahData.pemilik?.nama_pemilik || '-') 
              : 'Bukan Milik Anda' }}
          </p>
        </div>

        <div v-if="rumahData.keterangan">
          <label class="text-xs text-gray-500">Keterangan</label>
          <p class="text-sm">{{ rumahData.keterangan }}</p>
        </div>

        <div v-if="rumahData.latitude && rumahData.longitude" class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-gray-500">Latitude</label>
            <p class="text-sm font-mono">{{ rumahData.latitude }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500">Longitude</label>
            <p class="text-sm font-mono">{{ rumahData.longitude }}</p>
          </div>
        </div>

        <div v-if="rumahData.fotos && rumahData.fotos.length > 0">
          <label class="text-xs text-gray-500 mb-2 block">Foto Rumah</label>
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="(foto, index) in rumahData.fotos"
              :key="index"
              class="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              <NuxtImg
                :src="foto"
                :alt="`Foto rumah ${index + 1}`"
                class="w-full h-full object-cover cursor-pointer"
                @click="openImageModal(foto)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-else class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-gray-500 mb-1 block">RT</label>
            <p class="text-sm font-medium">{{ rumahData.rt?.label || '-' }}</p>
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1 block">
              Nomor Rumah <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <InputText
                v-model="rumahForm.nomor_rumah"
                class="flex-1"
                placeholder="Nomor rumah"
              />
              <Button
                icon="pi pi-check"
                size="small"
                outlined
                @click="handleValidateNomorRumah"
                :loading="validatingNomor"
                :disabled="!rumahForm.nomor_rumah"
              />
            </div>
            <small v-if="nomorRumahValidation" class="block mt-1" :class="nomorRumahValidation.is_valid ? 'text-green-600' : 'text-red-600'">
              {{ nomorRumahValidation.message }}
            </small>
          </div>
        </div>

        <div>
          <label class="text-xs text-gray-500 mb-1 block">
            Status Kepemilikan <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-4">
            <div class="flex items-center">
              <RadioButton
                v-model="rumahForm.is_milik_anda"
                inputId="milik-anda"
                :value="true"
              />
              <label for="milik-anda" class="ml-2 text-sm">Milik Anda</label>
            </div>
            <div class="flex items-center">
              <RadioButton
                v-model="rumahForm.is_milik_anda"
                inputId="bukan-milik"
                :value="false"
              />
              <label for="bukan-milik" class="ml-2 text-sm">Bukan</label>
            </div>
          </div>
        </div>

        <div v-if="rumahForm.is_milik_anda && anggotaKeluarga.length > 0">
          <label class="text-xs text-gray-500 mb-1 block">
            Pemilik <span class="text-red-500">*</span>
          </label>
          <Dropdown
            v-model="rumahForm.pemilik_id"
            :options="anggotaKeluarga"
            optionLabel="nama"
            optionValue="id"
            placeholder="Pilih pemilik"
            class="w-full"
          />
        </div>

        <div>
          <label class="text-xs text-gray-500 mb-1 block">Keterangan</label>
          <Textarea
            v-model="rumahForm.keterangan"
            rows="3"
            placeholder="Keterangan tambahan"
            class="w-full"
          />
        </div>

        <div>
          <label class="text-xs text-gray-500 mb-1 block">Koordinat Lokasi</label>
          <div class="flex gap-2 mb-2">
            <InputText
              v-model.number="rumahForm.latitude"
              placeholder="Latitude"
              class="flex-1"
            />
            <InputText
              v-model.number="rumahForm.longitude"
              placeholder="Longitude"
              class="flex-1"
            />
            <Button
              label="Pilih di Peta"
              icon="pi pi-map-marker"
              size="small"
              outlined
              @click="showMapDialog = true"
            />
          </div>
        </div>

        <div>
          <label class="text-xs text-gray-500 mb-1 block">Foto Rumah</label>
          <div v-if="existingFotos.length > 0" class="grid grid-cols-3 gap-2 mb-3">
            <div
              v-for="(foto, index) in existingFotos"
              :key="index"
              class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
            >
              <NuxtImg
                :src="foto"
                :alt="`Foto ${index + 1}`"
                class="w-full h-full object-cover"
              />
              <button
                @click="deleteExistingFoto(index)"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
          </div>
          <FileUpload
            mode="basic"
            :multiple="true"
            accept="image/*"
            :maxFileSize="5242880"
            @select="onFotoSelect"
            chooseLabel="Tambah Foto"
            class="w-full"
          />
          <small class="text-gray-500">Maksimal 5MB per file. Format: JPG, PNG</small>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      <p>Data rumah tidak ditemukan</p>
    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <Button
          v-if="!isEditMode"
          label="Tutup"
          severity="secondary"
          outlined
          @click="showRumahDialog = false"
        />
        <div v-else class="flex gap-2">
          <Button
            label="Batal"
            severity="secondary"
            outlined
            @click="cancelEdit"
          />
          <Button
            label="Simpan"
            @click="saveRumahData"
            :loading="savingRumah"
          />
        </div>
        <Button
          v-if="!isEditMode && rumahData"
          label="Edit"
          icon="pi pi-pencil"
          @click="isEditMode = true"
        />
      </div>
    </template>
  </Dialog>

  <!-- Map Dialog for Location -->
  <Dialog
    v-model:visible="showMapDialog"
    modal
    header="Pilih Lokasi"
    :style="{ width: '95%', maxWidth: '500px' }"
    @show="onMapDialogShow"
  >
    <div class="h-[400px] w-full relative">
      <div class="absolute top-2 right-2 z-[1000]">
        <Button
          label="Lokasi Saya"
          icon="pi pi-crosshairs"
          size="small"
          outlined
          @click="getMyLocation"
          :loading="gettingLocation"
          class="bg-white shadow-md"
        />
      </div>
      <ClientOnly>
        <MapLeaflet
          ref="mapRef"
          v-if="showMapDialog"
          :lat="mapLat"
          :lng="mapLng"
          :selectable="true"
          @location-selected="onLocationSelected"
        />
      </ClientOnly>
    </div>
    <template #footer>
      <Button
        label="Batal"
        severity="secondary"
        outlined
        @click="showMapDialog = false"
      />
      <Button
        label="Simpan Lokasi"
        @click="saveLocation"
      />
    </template>
  </Dialog>

  <!-- Image Modal -->
  <Dialog
    v-model:visible="showImageModal"
    modal
    :style="{ width: '90%', maxWidth: '600px' }"
    :closable="true"
    :header="false"
  >
    <div class="relative">
      <NuxtImg
        v-if="selectedImage"
        :src="selectedImage"
        alt="Preview"
        class="w-full h-auto rounded-lg"
      />
    </div>
  </Dialog>

  <!-- Logout Confirmation Dialog -->
  <Dialog
    v-model:visible="showLogoutDialog"
    modal
    header="Konfirmasi Logout"
    :style="{ width: '90%', maxWidth: '400px' }"
  >
    <p>Apakah Anda yakin ingin logout?</p>
    <template #footer>
      <Button
        label="Batal"
        severity="secondary"
        outlined
        @click="showLogoutDialog = false"
      />
      <Button
        label="Logout"
        severity="danger"
        @click="handleLogout"
        :loading="logoutLoading"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Card, Dialog, Button, ProgressSpinner, InputText, Textarea, RadioButton, Dropdown, FileUpload } from "primevue";

const { user: userData, logout } = useAuth()
const { get } = useApi()
const router = useRouter()
const toast = useToast()
const { getRumahSaya, validateNomorRumah, updateRumahSaya } = useRumah()

const profileData = ref<any>(null)
const showLogoutDialog = ref(false)
const logoutLoading = ref(false)

// Rumah data
const showRumahDialog = ref(false)
const rumahData = ref<any>(null)
const loadingRumah = ref(false)
const isEditMode = ref(false)
const rumahForm = ref({
  nomor_rumah: '',
  is_milik_anda: true,
  pemilik_id: null as number | null,
  keterangan: '',
  latitude: null as number | null,
  longitude: null as number | null,
  fotos: [] as File[],
  deleted_fotos: [] as number[]
})
const anggotaKeluarga = ref<any[]>([])
const existingFotos = ref<string[]>([])
const newFotos = ref<File[]>([])
const validatingNomor = ref(false)
const nomorRumahValidation = ref<any>(null)
const savingRumah = ref(false)

// Map dialog
const showMapDialog = ref(false)
const mapLat = ref(-6.5641311)
const mapLng = ref(106.6438673)
const mapRef = ref(null)
const gettingLocation = ref(false)
const tempLocation = ref<any>(null)

// Image modal
const showImageModal = ref(false)
const selectedImage = ref<string | null>(null)

const menuItems = [
  {
    id: 'rumah',
    label: 'Rumah',
    description: 'Data rumah Anda',
    icon: 'pi pi-home',
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  {
    id: 'berita',
    label: 'Berita & Pengumuman',
    description: 'Lihat berita dan pengumuman terbaru',
    icon: 'pi pi-list',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    route: '/berita'
  },
  {
    id: 'riwayat',
    label: 'Riwayat',
    description: 'Riwayat layanan Anda',
    icon: 'pi pi-history',
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-600',
    route: '/history'
  },
  {
    id: 'kebijakan-privasi',
    label: 'Kebijakan Privasi',
    description: 'Ketentuan privasi data pengguna',
    icon: 'pi pi-shield',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 'syarat-ketentuan',
    label: 'Syarat & Ketentuan',
    description: 'Ketentuan penggunaan aplikasi',
    icon: 'pi pi-file',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    id: 'tentang',
    label: 'Tentang Aplikasi',
    description: 'Informasi tentang SIGAP',
    icon: 'pi pi-info-circle',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 'bantuan',
    label: 'Bantuan',
    description: 'Pusat bantuan dan FAQ',
    icon: 'pi pi-question-circle',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    id: 'kontak',
    label: 'Kontak',
    description: 'Hubungi kami',
    icon: 'pi pi-phone',
    bgColor: 'bg-teal-100',
    iconColor: 'text-teal-600'
  }
]

const handleMenuClick = (menu: any) => {
  // Jika menu punya route, redirect ke route tersebut
  if (menu.route) {
    router.push(menu.route)
    return
  }

  switch (menu.id) {
    case 'rumah':
      showRumahDialog.value = true
      break
    case 'kebijakan-privasi':
      router.push('/profile/kebijakan-privasi')
      break
    case 'syarat-ketentuan':
      router.push('/profile/syarat-ketentuan')
      break
    case 'tentang':
      router.push('/profile/tentang-aplikasi')
      break
    case 'bantuan':
      toast.add({
        severity: 'info',
        summary: 'Bantuan',
        detail: 'Halaman bantuan akan segera tersedia',
        life: 3000
      })
      break
    case 'kontak':
      toast.add({
        severity: 'info',
        summary: 'Kontak',
        detail: 'Email: info@sigap.go.id\nTelp: (0251) 1234567',
        life: 4000
      })
      break
  }
}

// Fetch profile data
onMounted(async () => {
  try {
    const response = await get('/profile')
    if (response.success && response.data) {
      profileData.value = response.data
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error.response?.message || error.message || 'Gagal memuat data profile',
      life: 3000
    })
  }
})

const handleLogout = async () => {
  logoutLoading.value = true
  
  try {
    await logout()
    
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Logout berhasil',
      life: 3000
    })
    
    showLogoutDialog.value = false
    router.push('/auth')
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error.response?.message || error.message || 'Gagal logout',
      life: 3000
    })
  } finally {
    logoutLoading.value = false
  }
}

// Rumah functions
const loadRumahData = async () => {
  loadingRumah.value = true
  try {
    const response = await getRumahSaya()
    if (response.success && response.data) {
      rumahData.value = response.data
      anggotaKeluarga.value = response.data.anggota_keluarga || []
      existingFotos.value = [...(response.data.fotos || [])]
      
      // Reset form
      rumahForm.value = {
        nomor_rumah: response.data.nomor_rumah || '',
        is_milik_anda: response.data.pemilik?.is_milik_anda ?? true,
        pemilik_id: response.data.pemilik?.pemilik_id || null,
        keterangan: response.data.keterangan || '',
        latitude: response.data.latitude || null,
        longitude: response.data.longitude || null,
        fotos: [],
        deleted_fotos: []
      }
      newFotos.value = []
      nomorRumahValidation.value = null
      isEditMode.value = false
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error.response?.message || error.message || 'Gagal memuat data rumah',
      life: 3000
    })
  } finally {
    loadingRumah.value = false
  }
}

const handleValidateNomorRumah = async () => {
  if (!rumahForm.value.nomor_rumah) return
  
  validatingNomor.value = true
  try {
    const response = await validateNomorRumah(rumahForm.value.nomor_rumah)
    if (response.success && response.data) {
      nomorRumahValidation.value = response.data
      toast.add({
        severity: response.data.is_valid ? 'success' : 'warn',
        summary: 'Validasi',
        detail: response.data.message,
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.message || error.message || 'Gagal validasi nomor rumah',
      life: 3000
    })
  } finally {
    validatingNomor.value = false
  }
}

const onFotoSelect = (event: any) => {
  const files = Array.from(event.files) as File[]
  newFotos.value = [...newFotos.value, ...files]
  rumahForm.value.fotos = [...rumahForm.value.fotos, ...files]
}

const deleteExistingFoto = (index: number) => {
  existingFotos.value.splice(index, 1)
  rumahForm.value.deleted_fotos.push(index)
}

const cancelEdit = () => {
  isEditMode.value = false
  loadRumahData()
}

const saveRumahData = async () => {
  if (!rumahForm.value.nomor_rumah) {
    toast.add({
      severity: 'warn',
      summary: 'Peringatan',
      detail: 'Nomor rumah wajib diisi',
      life: 3000
    })
    return
  }

  if (rumahForm.value.is_milik_anda && !rumahForm.value.pemilik_id) {
    toast.add({
      severity: 'warn',
      summary: 'Peringatan',
      detail: 'Pemilik wajib dipilih jika rumah milik Anda',
      life: 3000
    })
    return
  }

  savingRumah.value = true
  try {
    const updateData: any = {
      nomor_rumah: rumahForm.value.nomor_rumah,
      is_milik_anda: rumahForm.value.is_milik_anda,
      keterangan: rumahForm.value.keterangan || '',
      latitude: rumahForm.value.latitude,
      longitude: rumahForm.value.longitude,
      fotos: newFotos.value,
      deleted_fotos: rumahForm.value.deleted_fotos
    }

    if (rumahForm.value.is_milik_anda && rumahForm.value.pemilik_id) {
      updateData.pemilik_id = rumahForm.value.pemilik_id
    } else {
      updateData.pemilik_id = null
    }

    const response = await updateRumahSaya(updateData)
    
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: response.message || 'Data rumah berhasil diperbarui',
        life: 3000
      })
      
      isEditMode.value = false
      await loadRumahData()
    }
  } catch (error: any) {
    const errorMessage = error.response?.message || error.message || 'Gagal memperbarui data rumah'
    const errors = error.response?.errors || null
    
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: errors ? Object.values(errors).flat().join(', ') : errorMessage,
      life: 5000
    })
  } finally {
    savingRumah.value = false
  }
}

// Map functions
const onMapDialogShow = () => {
  if (rumahForm.value.latitude && rumahForm.value.longitude) {
    mapLat.value = rumahForm.value.latitude
    mapLng.value = rumahForm.value.longitude
  }
}

const onLocationSelected = async (location: { lat: number, lng: number }) => {
  tempLocation.value = { lat: location.lat, lng: location.lng }
}

const saveLocation = () => {
  if (tempLocation.value) {
    rumahForm.value.latitude = tempLocation.value.lat
    rumahForm.value.longitude = tempLocation.value.lng
    showMapDialog.value = false
  }
}

const getMyLocation = async () => {
  gettingLocation.value = true
  try {
    if (mapRef.value && mapRef.value.getCurrentLocation) {
      const location = await mapRef.value.getCurrentLocation()
      if (location && location.lat && location.lng) {
        await onLocationSelected({ lat: location.lat, lng: location.lng })
      }
    } else {
      if (!navigator.geolocation) {
        toast.add({
          severity: 'warn',
          summary: 'Peringatan',
          detail: 'Geolocation tidak didukung oleh browser Anda',
          life: 3000
        })
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          mapLat.value = latitude
          mapLng.value = longitude
          await onLocationSelected({ lat: latitude, lng: longitude })
        },
        (error) => {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal mendapatkan lokasi. Pastikan izin lokasi sudah diberikan.',
            life: 3000
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error?.error || 'Gagal mendapatkan lokasi',
      life: 3000
    })
  } finally {
    gettingLocation.value = false
  }
}

const openImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl
  showImageModal.value = true
}
</script>
