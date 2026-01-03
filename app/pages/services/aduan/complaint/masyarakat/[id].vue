<template>
  <div class="min-h-screen bg-white pb-20">
    <div class="bg-white sticky top-0 z-10 border-b border-gray-200">
      <div class="px-5 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button
              @click="goBack"
              class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors -ml-2"
            >
              <i class="pi pi-arrow-left text-gray-700 text-xl"></i>
            </button>
            <h1 class="font-semibold text-xl text-gray-800">Detail Aduan</h1>
          </div>
          <div class="flex items-center gap-2">
            <Button
              icon="pi pi-share-alt"
              rounded
              text
              severity="secondary"
              @click="handleShare"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <ProgressSpinner />
    </div>

    <div v-else-if="aduan" class="px-5 py-4 space-y-4">
      <div class="flex items-start gap-4 mb-4">
        <div class="flex-shrink-0">
          <div class="w-20 h-20 rounded-xl overflow-hidden  flex items-center justify-center">
            <NuxtImg
              src="/marketing.png"
              alt="Icon"
              class="w-16 h-16 object-contain"
            />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div v-if="!isEditMode" class="flex items-start gap-2">
            <h2 class="font-bold text-xl text-gray-800 mb-2 flex-1">{{ aduan.judul }}</h2>
            <button
              v-if="!isEditMode"
              @click="enableEditMode"
              class="text-primary-500 hover:text-primary-600 transition-colors"
            >
              <i class="pi pi-pencil text-lg"></i>
            </button>
          </div>
          <div v-else class="flex items-start gap-2">
            <InputText
              v-model="editData.judul"
              class="flex-1"
              placeholder="Judul Aduan"
            />
          </div>
          <p class="text-sm text-gray-500 mb-3">
            Diajukan pada {{ formatDateTime(aduan.created_at) }}
          </p>
          <div class="flex items-center gap-2 flex-wrap">
            <Tag
              :value="formatStatus(aduan.status)"
              :severity="getStatusSeverity(aduan.status)"
            />
            <Tag
              v-if="!isEditMode"
              :value="aduan.kategori_aduan_nama"
              severity="info"
            />
            <Select
              v-else
              v-model="editData.kategori_aduan_id"
              :options="kategoriOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Pilih Kategori"
              class="w-48"
            />
          </div>
        </div>
      </div>

      <Card class="border border-gray-200">
        <template #content>
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-base text-gray-800">Deskripsi Aduan</h3>
              <button
                v-if="!isEditMode"
                @click="enableEditMode"
                class="text-primary-500 hover:text-primary-600 transition-colors"
              >
                <i class="pi pi-pencil text-sm"></i>
              </button>
            </div>
            <p v-if="!isEditMode" class="text-gray-700 leading-relaxed">{{ aduan.detail_aduan }}</p>
            <Textarea
              v-else
              v-model="editData.detail_aduan"
              rows="5"
              autoResize
              class="w-full"
              placeholder="Deskripsi Aduan"
            />
          </div>
        </template>
      </Card>

      <Card class="border border-gray-200">
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-base text-gray-800">Lokasi</h3>
              <button
                v-if="!isEditMode"
                @click="enableEditMode"
                class="text-primary-500 hover:text-primary-600 transition-colors"
              >
                <i class="pi pi-pencil text-sm"></i>
              </button>
            </div>
            <div class="space-y-3">
              <div class="flex items-start gap-2">
                <i class="pi pi-map-marker text-primary-500 mt-1"></i>
                <div class="flex-1">
                  <p v-if="!isEditMode" class="font-medium text-sm text-gray-800">{{ aduan.nama_lokasi }}</p>
                  <InputText
                    v-else
                    v-model="editData.nama_lokasi"
                    class="w-full"
                    placeholder="Nama Lokasi"
                  />
                </div>
              </div>
              <div v-if="aduan.deskripsi_lokasi || isEditMode" class="flex items-start gap-2">
                <i class="pi pi-info-circle text-gray-400 mt-1"></i>
                <div class="flex-1">
                  <p v-if="!isEditMode" class="text-sm text-gray-600">{{ aduan.deskripsi_lokasi }}</p>
                  <Textarea
                    v-else
                    v-model="editData.deskripsi_lokasi"
                    rows="3"
                    autoResize
                    class="w-full"
                    placeholder="Deskripsi Lokasi"
                  />
                </div>
              </div>
            </div>
            <div v-if="(aduan.latitude && aduan.longitude) || isEditMode" class="mt-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-sm text-gray-700">Peta Lokasi</h4>
                <div class="flex items-center gap-2">
                  <Button
                    v-if="!isEditMode"
                    label="Buka di Maps"
                    icon="pi pi-map"
                    size="small"
                    outlined
                    @click="openInMaps"
                  />
                  <Button
                    v-else
                    label="Pilih Lokasi"
                    icon="pi pi-map-marker"
                    size="small"
                    outlined
                    @click="showMapDialog = true"
                  />
                </div>
              </div>
              <div class="w-full h-64 rounded-lg overflow-hidden border border-gray-200 relative">
                <ClientOnly>
                  <MapLeaflet
                    :key="`map-${isEditMode}-${editData.latitude || aduan.latitude}`"
                    :lat="isEditMode ? (editData.latitude || parseFloat(aduan.latitude)) : parseFloat(aduan.latitude)"
                    :lng="isEditMode ? (editData.longitude || parseFloat(aduan.longitude)) : parseFloat(aduan.longitude)"
                    :selectable="isEditMode"
                    :zoom="15"
                    @location-selected="onLocationSelected"
                  />
                </ClientOnly>
                <div v-if="isEditMode && reverseGeocodingLoading" class="absolute top-2 left-2 bg-white/90 px-3 py-2 rounded-lg flex items-center gap-2 text-sm text-gray-600 z-10">
                  <ProgressSpinner style="width: 16px; height: 16px" />
                  <span>Mengambil alamat...</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="(aduan.files && aduan.files.length > 0) || isEditMode" class="border border-gray-200">
        <template #content>
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-base text-gray-800">Bukti Laporan</h3>
              <button
                v-if="!isEditMode"
                @click="enableEditMode"
                class="text-primary-500 hover:text-primary-600 transition-colors"
              >
                <i class="pi pi-pencil text-sm"></i>
              </button>
            </div>
            
            <!-- Existing Files -->
            <div v-if="existingFiles.length > 0" class="grid grid-cols-2 gap-3 mb-4" :key="`files-${aduan?.id || 0}-${existingFiles.length}`">
              <div
                v-for="(file, index) in existingFiles"
                :key="`file-${file.id}-${index}`"
                class="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
              >
                <div
                  class="w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
                  @click="!isEditMode && openImagePreview(getOriginalFileIndex(file.id))"
                >
                  <NuxtImg
                    :src="file.file_path"
                    :alt="file.file_name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <button
                  v-if="isEditMode"
                  @click="removeExistingFile(file.id)"
                  class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                >
                  <i class="pi pi-times text-sm"></i>
                </button>
              </div>
            </div>
            
            <!-- New Files Preview -->
            <div v-if="isEditMode && editData.files && editData.files.length > 0" class="grid grid-cols-2 gap-3 mb-4">
              <div
                v-for="(file, index) in editData.files"
                :key="`new-${index}`"
                class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
              >
                <img
                  v-if="file"
                  :src="getFilePreview(file)"
                  :alt="file.name || 'Preview'"
                  class="w-full h-full object-cover"
                />
                <button
                  @click="removeNewFile(index)"
                  class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                >
                  <i class="pi pi-times text-sm"></i>
                </button>
              </div>
            </div>
            
            <!-- File Upload -->
            <div v-if="isEditMode" class="mt-4">
              <FileUpload
                mode="basic"
                name="files[]"
                :multiple="true"
                accept="image/*"
                :maxFileSize="5000000"
                :auto="false"
                chooseLabel="Pilih File Baru"
                @select="onFileSelect"
                :fileLimit="10"
              >
                <template #empty>
                  <div class="flex flex-col items-center justify-center py-4 text-center">
                    <i class="pi pi-cloud-upload text-3xl text-gray-400 mb-2"></i>
                    <p class="text-sm text-gray-500">Klik untuk memilih file</p>
                  </div>
                </template>
              </FileUpload>
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="aduan.alasan_melaporkan || isEditMode" class="border border-gray-200">
        <template #content>
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-base text-gray-800">Alasan Melaporkan</h3>
              <button
                v-if="!isEditMode"
                @click="enableEditMode"
                class="text-primary-500 hover:text-primary-600 transition-colors"
              >
                <i class="pi pi-pencil text-sm"></i>
              </button>
            </div>
            <p v-if="!isEditMode" class="text-gray-700">{{ aduan.alasan_melaporkan }}</p>
            <Textarea
              v-else
              v-model="editData.alasan_melaporkan"
              rows="4"
              autoResize
              class="w-full"
              placeholder="Alasan Melaporkan"
            />
          </div>
        </template>
      </Card>

      <div class="flex gap-3 pt-4">
        <Button
          v-if="!isEditMode"
          label="Edit"
          icon="pi pi-pencil"
          outlined
          class="flex-1"
          @click="enableEditMode"
        />
        <Button
          v-else
          label="Batal"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="flex-1"
          @click="cancelEdit"
        />
        <Button
          v-if="!isEditMode"
          label="Hapus"
          icon="pi pi-trash"
          severity="danger"
          outlined
          class="flex-1"
          @click="showDeleteDialog = true"
        />
        <Button
          v-else
          label="Simpan"
          icon="pi pi-check"
          class="flex-1"
          :loading="saving"
          @click="saveEdit"
        />
      </div>
    </div>

    <Dialog
      v-model:visible="showDeleteDialog"
      modal
      header="Konfirmasi Hapus"
      :style="{ width: '90%', maxWidth: '400px' }"
    >
      <p>Apakah Anda yakin ingin menghapus aduan ini?</p>
      <template #footer>
        <Button
          label="Batal"
          severity="secondary"
          outlined
          @click="showDeleteDialog = false"
        />
        <Button
          label="Hapus"
          severity="danger"
          :loading="deleting"
          @click="handleDelete"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="showImageDialog"
      modal
      :style="{ width: '95%', maxWidth: '800px' }"
      :closable="true"
      class="image-preview-dialog"
    >
      <template #header>
        <div class="flex items-center justify-between w-full">
          <span class="font-semibold text-lg">Preview Gambar</span>
          <span class="text-sm text-gray-500">
            {{ currentImageIndex + 1 }} / {{ aduan?.files?.length || 0 }}
          </span>
        </div>
      </template>
      <div class="relative">
        <div v-if="currentImage" class="flex items-center justify-center min-h-[400px]">
          <NuxtImg
            :src="currentImage.file_path"
            :alt="currentImage.file_name"
            class="max-w-full max-h-[70vh] object-contain"
          />
        </div>
        <div v-if="aduan?.files && aduan.files.length > 1" class="flex items-center justify-between mt-4">
          <Button
            icon="pi pi-chevron-left"
            rounded
            outlined
            :disabled="currentImageIndex === 0"
            @click="previousImage"
          />
          <Button
            icon="pi pi-chevron-right"
            rounded
            outlined
            :disabled="currentImageIndex === (aduan.files.length - 1)"
            @click="nextImage"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { Card, Button, Dialog, ProgressSpinner, Tag, InputText, Textarea, Select, FileUpload } from 'primevue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { getDetailAduan, deleteAduan, updateAduan, getKategoriAduan } = useAduan()

const aduan = ref(null)
const loading = ref(false)
const deleting = ref(false)
const saving = ref(false)
const showDeleteDialog = ref(false)
const showImageDialog = ref(false)
const currentImageIndex = ref(0)
const isEditMode = ref(false)
const editData = ref({})
const kategoriOptions = ref([])
const showMapDialog = ref(false)
const reverseGeocodingLoading = ref(false)

const goBack = () => {
  router.back()
}

const fetchDetail = async (forceRefresh = false) => {
  const id = parseInt(String(route.params.id))
  if (!id) return

  loading.value = true

  try {
    const params = forceRefresh ? { _t: Date.now() } : {}
    const response = await getDetailAduan(id, params)
    if (response.success && response.data) {
      aduan.value = {
        ...response.data,
        files: response.data.files ? [...response.data.files] : []
      }
      
      await nextTick()
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat detail aduan'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 3000
    })
    router.back()
  } finally {
    loading.value = false
  }
}

const enableEditMode = async () => {
  if (!aduan.value) return
  
  try {
    const kategoriResponse = await getKategoriAduan()
    if (kategoriResponse.success && kategoriResponse.data) {
      kategoriOptions.value = kategoriResponse.data
    }
  } catch (error) {
    // Silent error
  }
  
  editData.value = {
    kategori_aduan_id: aduan.value.kategori_aduan_id,
    judul: aduan.value.judul,
    detail_aduan: aduan.value.detail_aduan,
    alasan_melaporkan: aduan.value.alasan_melaporkan || '',
    latitude: aduan.value.latitude ? parseFloat(aduan.value.latitude) : null,
    longitude: aduan.value.longitude ? parseFloat(aduan.value.longitude) : null,
    nama_lokasi: aduan.value.nama_lokasi,
    deskripsi_lokasi: aduan.value.deskripsi_lokasi,
    jenis_aduan: aduan.value.jenis_aduan,
    files: [],
    deletedFiles: [],
    existingFiles: aduan.value.files ? [...aduan.value.files] : []
  }
  
  isEditMode.value = true
}

const cancelEdit = () => {
  isEditMode.value = false
  editData.value = {}
  showMapDialog.value = false
}

const existingFiles = computed(() => {
  if (!aduan.value || !aduan.value.files) return []
  if (!isEditMode.value) {
    return [...aduan.value.files]
  }
  const deletedIds = editData.value.deletedFiles || []
  return aduan.value.files.filter(file => !deletedIds.includes(file.id))
})

const removeExistingFile = (fileId) => {
  if (!editData.value.deletedFiles) {
    editData.value.deletedFiles = []
  }
  editData.value.deletedFiles.push(fileId)
}

const removeNewFile = (index) => {
  if (editData.value.files) {
    editData.value.files.splice(index, 1)
  }
}

const onFileSelect = (event) => {
  const files = Array.from(event.files)
  if (!editData.value.files) {
    editData.value.files = []
  }
  editData.value.files = [...editData.value.files, ...files]
}

const getOriginalFileIndex = (fileId) => {
  if (!aduan.value || !aduan.value.files) return 0
  return aduan.value.files.findIndex(f => f.id === fileId)
}

const getFilePreview = (file) => {
  if (!file) return ''
  try {
    if (file && typeof file === 'object' && 'name' in file && 'size' in file && 'type' in file) {
      if (typeof window !== 'undefined' && window.URL && window.URL.createObjectURL) {
        return URL.createObjectURL(file)
      }
    }
  } catch (error) {
    // Silent error
  }
  return ''
}

const onLocationSelected = async (location) => {
  editData.value.latitude = location.lat
  editData.value.longitude = location.lng
  
  reverseGeocodingLoading.value = true
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1&accept-language=id`,
      {
        headers: {
          'User-Agent': 'SIGAP-Desa-Digital/1.0',
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      if (data) {
        const address = data.address || {}
        const road = address.road || ''
        const village = address.village || address.suburb || ''
        const district = address.district || address.city_district || ''
        const city = address.city || address.county || ''

        const addressParts = [road, village, district, city].filter(Boolean)
        const fullAddress = addressParts.join(', ') || data.display_name

        editData.value.deskripsi_lokasi = fullAddress

        const addressPartsArray = fullAddress.split(',')
        editData.value.nama_lokasi = addressPartsArray[0]?.trim() || `Lokasi Aduan (${location.lat.toFixed(6)}, ${location.lng.toFixed(6)})`
      }
    }
  } catch (error) {
    console.error('Reverse geocode error:', error)
    editData.value.nama_lokasi = `Lokasi Aduan (${location.lat.toFixed(6)}, ${location.lng.toFixed(6)})`
  } finally {
    reverseGeocodingLoading.value = false
  }
}

const saveEdit = async () => {
  if (!aduan.value) return
  
  saving.value = true
  
  try {
    const deletedFiles = Array.isArray(editData.value.deletedFiles) ? editData.value.deletedFiles : []
    const newFiles = Array.isArray(editData.value.files) ? editData.value.files : []
    
    const response = await updateAduan(aduan.value.id, {
      kategori_aduan_id: editData.value.kategori_aduan_id,
      judul: editData.value.judul,
      detail_aduan: editData.value.detail_aduan,
      latitude: editData.value.latitude,
      longitude: editData.value.longitude,
      nama_lokasi: editData.value.nama_lokasi,
      deskripsi_lokasi: editData.value.deskripsi_lokasi,
      jenis_aduan: editData.value.jenis_aduan,
      alasan_melaporkan: editData.value.alasan_melaporkan || '',
      files: newFiles,
      deleted_files: deletedFiles
    })
    
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: response.message || 'Aduan berhasil diupdate',
        life: 3000
      })
      
      isEditMode.value = false
      editData.value = {}
      
      aduan.value = null
      await nextTick()
      
      await new Promise(resolve => setTimeout(resolve, 300))
      await fetchDetail(true)
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal mengupdate aduan'
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: errorMessage,
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

const handleShare = async () => {
  const shareData = {
    title: aduan.value.judul,
    text: `${aduan.value.judul}\n${aduan.value.detail_aduan}`,
    url: window.location.href
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: 'Link berhasil disalin ke clipboard',
        life: 3000
      })
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.add({
          severity: 'success',
          summary: 'Berhasil',
          detail: 'Link berhasil disalin ke clipboard',
          life: 3000
        })
      } catch (clipboardError) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Gagal membagikan aduan',
          life: 3000
        })
      }
    }
  }
}

const openInMaps = () => {
  if (!aduan.value.latitude || !aduan.value.longitude) return

  const lat = parseFloat(aduan.value.latitude)
  const lng = parseFloat(aduan.value.longitude)
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)
  
  if (isIOS) {
    window.open(`maps://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`, '_blank')
  } else if (isAndroid) {
    window.open(`geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(aduan.value.nama_lokasi)})`, '_blank')
  } else {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
  }
}

const openImagePreview = (index) => {
  currentImageIndex.value = index
  showImageDialog.value = true
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (aduan.value?.files && currentImageIndex.value < aduan.value.files.length - 1) {
    currentImageIndex.value++
  }
}

const currentImage = computed(() => {
  if (aduan.value?.files && aduan.value.files[currentImageIndex.value]) {
    return aduan.value.files[currentImageIndex.value]
  }
  return null
})

const handleDelete = async () => {
  if (!aduan.value) return

  deleting.value = true

  try {
    const response = await deleteAduan(aduan.value.id)
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: response.message || 'Aduan berhasil dihapus',
        life: 3000
      })
      router.push('/services/complaint/masyarakat')
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal menghapus aduan'
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: errorMessage,
      life: 3000
    })
  } finally {
    deleting.value = false
    showDeleteDialog.value = false
  }
}

const formatStatus = (status) => {
  const statusMap = {
    'menunggu_verifikasi': 'Menunggu Verifikasi',
    'diverifikasi': 'Diverifikasi',
    'ditolak': 'Ditolak',
    'diproses': 'Diproses',
    'selesai': 'Selesai'
  }
  return statusMap[status] || status
}

const getStatusSeverity = (status) => {
  const severityMap = {
    'menunggu_verifikasi': 'warning',
    'diverifikasi': 'info',
    'ditolak': 'danger',
    'diproses': 'secondary',
    'selesai': 'success'
  }
  return severityMap[status] || null
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchDetail()
})
</script>

