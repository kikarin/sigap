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
            <h1 class="font-semibold text-xl text-gray-800">Detail Proposal</h1>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <ProgressSpinner />
    </div>

    <div v-else-if="proposal" class="px-5 py-4 space-y-4">
      <div v-if="proposal.thumbnail_foto_banner" class="mb-4">
        <div v-if="!isEditMode" class="relative">
          <NuxtImg
            :src="proposal.thumbnail_foto_banner"
            :alt="proposal.nama_kegiatan"
            class="w-full h-48 object-cover rounded-xl"
          />
        </div>
        <div v-else class="space-y-3">
          <div v-if="editData.thumbnail_foto_banner_preview" class="relative">
            <img
              :src="editData.thumbnail_foto_banner_preview"
              alt="Preview"
              class="w-full h-48 object-cover rounded-xl"
            />
            <Button
              icon="pi pi-times"
              severity="danger"
              rounded
              @click="removeBanner"
              class="absolute top-2 right-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Upload Thumbnail/Foto Banner Baru
            </label>
            <input
              ref="bannerInput"
              type="file"
              accept="image/*"
              @change="handleBannerSelect"
              class="hidden"
            />
            <Button
              label="Pilih File"
              icon="pi pi-upload"
              outlined
              @click="bannerInput?.click()"
            />
          </div>
        </div>
      </div>

      <div class="flex items-start gap-4 mb-4">
        <div class="flex-1 min-w-0">
          <div v-if="!isEditMode" class="flex items-start gap-2">
            <h2 class="font-bold text-xl text-gray-800 mb-2 flex-1">{{ proposal.nama_kegiatan }}</h2>
          </div>
          <div v-else class="flex items-start gap-2">
            <InputText
              v-model="editData.nama_kegiatan"
              class="flex-1"
              placeholder="Nama Kegiatan"
            />
          </div>
          <p class="text-sm text-gray-500 mb-3">
            Diajukan pada {{ formatDateTime(proposal.created_at) }}
          </p>
          <div class="flex items-center gap-2 flex-wrap">
            <Tag
              :value="proposal.status_label || formatStatus(proposal.status)"
              :severity="getStatusSeverity(proposal.status)"
            />
            <Tag
              v-if="!isEditMode"
              :value="proposal.kategori_proposal_nama"
              severity="info"
            />
            <Select
              v-else
              v-model="editData.kategori_proposal_id"
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
              <h3 class="font-semibold text-base text-gray-800">Deskripsi Kegiatan</h3>
            </div>
            <p v-if="!isEditMode" class="text-gray-700 leading-relaxed">{{ proposal.deskripsi_kegiatan }}</p>
            <Textarea
              v-else
              v-model="editData.deskripsi_kegiatan"
              rows="5"
              autoResize
              class="w-full"
              placeholder="Deskripsi Kegiatan"
            />
          </div>
        </template>
      </Card>

      <Card class="border border-gray-200">
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-base text-gray-800">Usulan Anggaran</h3>
            </div>
            <div>
              <p v-if="!isEditMode" class="text-lg font-semibold text-primary-500">
                {{ proposal.usulan_anggaran_formatted || formatCurrency(proposal.usulan_anggaran) }}
              </p>
              <InputNumber
                v-else
                v-model="editData.usulan_anggaran"
                mode="currency"
                currency="IDR"
                locale="id-ID"
                :min="0"
                class="w-full"
              />
            </div>
          </div>
        </template>
      </Card>

      <Card class="border border-gray-200">
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-base text-gray-800">Nomor Telepon</h3>
            </div>
            <div>
              <p v-if="!isEditMode" class="text-gray-700">
                {{ proposal.nomor_telepon_pengaju || '-' }}
              </p>
              <InputMask
                v-else
                v-model="editData.nomor_telepon_pengaju"
                mask="(+62) 899-9999-9999"
                placeholder="(+62) 899-9999-9999"
                class="w-full"
              />
            </div>
          </div>
        </template>
      </Card>

      <Card class="border border-gray-200">
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-base text-gray-800">Lokasi</h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-start gap-2">
                <i class="pi pi-map-marker text-primary-500 mt-1"></i>
                <div class="flex-1">
                  <p v-if="!isEditMode" class="font-medium text-sm text-gray-800">{{ proposal.nama_lokasi }}</p>
                  <InputText
                    v-else
                    v-model="editData.nama_lokasi"
                    class="w-full"
                    placeholder="Nama Lokasi"
                  />
                </div>
              </div>
              <div class="flex items-start gap-2">
                <i class="pi pi-info-circle text-gray-400 mt-1"></i>
                <div class="flex-1">
                  <p v-if="!isEditMode" class="text-sm text-gray-600">{{ proposal.alamat }}</p>
                  <Textarea
                    v-else
                    v-model="editData.alamat"
                    rows="3"
                    autoResize
                    class="w-full"
                    placeholder="Alamat"
                  />
                </div>
              </div>
              <div v-if="proposal.latitude && proposal.longitude" class="mt-4">
                <div v-if="!isEditMode" class="h-64 rounded-lg overflow-hidden border border-gray-200">
                  <ClientOnly>
                    <MapLeaflet
                      :lat="parseFloat(proposal.latitude)"
                      :lng="parseFloat(proposal.longitude)"
                      :selectable="false"
                    />
                  </ClientOnly>
                </div>
                <div v-else class="space-y-3">
                  <div class="h-64 rounded-lg overflow-hidden border border-gray-200">
                    <ClientOnly>
                      <MapLeaflet
                        :key="`map-edit-${isEditMode}`"
                        :lat="editData.latitude || parseFloat(proposal.latitude)"
                        :lng="editData.longitude || parseFloat(proposal.longitude)"
                        :selectable="true"
                        @location-selected="onLocationSelected"
                      />
                    </ClientOnly>
                  </div>
                  <Button
                    label="Pilih Lokasi Baru"
                    icon="pi pi-map-marker"
                    outlined
                    @click="showMapDialog = true"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="proposal.file_pendukung && proposal.file_pendukung.length > 0" class="border border-gray-200">
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-base text-gray-800">File Pendukung</h3>
            </div>
            <div class="space-y-2">
              <div
                v-for="(file, index) in getExistingFiles()"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <i class="pi pi-file text-gray-600"></i>
                  <a
                    :href="file.path"
                    target="_blank"
                    class="text-sm text-primary-500 hover:underline truncate"
                  >
                    {{ file.name }}
                  </a>
                </div>
                <button
                  v-if="isEditMode"
                  @click="removeExistingFile(index)"
                  class="text-red-500 hover:text-red-700 transition-colors ml-2"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>
            <div v-if="isEditMode" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tambah File Pendukung
              </label>
              <input
                ref="fileInput"
                type="file"
                accept=".pdf,.doc,.docx,.xlsx,.xls"
                multiple
                @change="handleFileSelect"
                class="hidden"
              />
              <Button
                label="Pilih File"
                icon="pi pi-upload"
                outlined
                @click="fileInput?.click()"
              />
              <div v-if="getNewFiles().length > 0" class="mt-3 space-y-2">
                <div
                  v-for="(file, index) in getNewFiles()"
                  :key="index"
                  class="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <i class="pi pi-file text-blue-600"></i>
                    <span class="text-sm text-gray-700 truncate">{{ file.name }}</span>
                  </div>
                  <button
                    @click="removeNewFile(index)"
                    class="text-red-500 hover:text-red-700 transition-colors ml-2"
                  >
                    <i class="pi pi-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="proposal.tanda_tangan_digital" class="border border-gray-200">
        <template #content>
          <div>
            <h3 class="font-semibold text-base text-gray-800 mb-3">Tanda Tangan Digital</h3>
            <img
              :src="proposal.tanda_tangan_digital"
              alt="Tanda Tangan"
              class="max-w-full h-32 object-contain bg-gray-50 border border-gray-200 rounded"
            />
          </div>
        </template>
      </Card>

      <Card v-if="proposal.catatan_verifikasi" class="border border-gray-200">
        <template #content>
          <div>
            <h3 class="font-semibold text-base text-gray-800 mb-2">Catatan Verifikasi</h3>
            <p class="text-gray-700">{{ proposal.catatan_verifikasi }}</p>
            <p v-if="proposal.admin_verifikasi_nama" class="text-sm text-gray-500 mt-2">
              Oleh: {{ proposal.admin_verifikasi_nama }}
            </p>
            <p v-if="proposal.tanggal_diverifikasi" class="text-sm text-gray-500">
              Tanggal: {{ formatDateTime(proposal.tanggal_diverifikasi) }}
            </p>
          </div>
        </template>
      </Card>

      <div class="flex gap-3 pt-4">
        <Button
          v-if="!isEditMode && (proposal.status === 'menunggu_verifikasi' || proposal.status === 'ditolak')"
          label="Edit"
          icon="pi pi-pencil"
          outlined
          class="flex-1"
          @click="enableEditMode"
        />
        <Button
          v-if="!isEditMode && proposal.status !== 'disetujui'"
          label="Hapus"
          icon="pi pi-trash"
          severity="danger"
          outlined
          class="flex-1"
          @click="handleDelete"
        />
        <Button
          v-else-if="isEditMode"
          label="Batal"
          icon="pi pi-times"
          severity="secondary"
          outlined
          class="flex-1"
          @click="cancelEdit"
        />
        <Button
          v-if="!isEditMode && proposal.status === 'disetujui'"
          label="Download PDF"
          icon="pi pi-download"
          class="flex-1"
          :loading="exportingPDF"
          @click="handleExportPDF"
        />
        <Button
          v-if="isEditMode"
          label="Simpan"
          icon="pi pi-check"
          class="flex-1"
          :loading="saving"
          @click="saveEdit"
        />
      </div>
    </div>

    <Dialog
      v-model:visible="showMapDialog"
      modal
      header="Pilih Lokasi Baru"
      :style="{ width: '95%', maxWidth: '500px' }"
    >
      <div class="h-[400px] w-full relative">
        <ClientOnly>
          <MapLeaflet
            v-if="showMapDialog"
            :lat="editData.latitude || parseFloat(proposal?.latitude || -6.5641311)"
            :lng="editData.longitude || parseFloat(proposal?.longitude || 106.6438673)"
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
          label="Simpan"
          @click="showMapDialog = false"
        />
      </template>
    </Dialog>

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { Card, Button, Tag, ProgressSpinner, InputText, Textarea, InputNumber, InputMask, Select, Dialog, ConfirmDialog } from 'primevue'
import { useProposal } from '@/composables/useProposal'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const confirm = useConfirm()
const { getDetailPengajuanProposal, updatePengajuanProposal, deletePengajuanProposal, getKategoriProposal, exportPDF } = useProposal()

const proposal = ref(null)
const loading = ref(false)
const saving = ref(false)
const exportingPDF = ref(false)
const isEditMode = ref(false)
const showMapDialog = ref(false)
const kategoriOptions = ref([])
const bannerInput = ref(null)
const fileInput = ref(null)

const editData = ref({
  kategori_proposal_id: null,
  nomor_telepon_pengaju: '',
  nama_kegiatan: '',
  deskripsi_kegiatan: '',
  usulan_anggaran: null,
  latitude: null,
  longitude: null,
  nama_lokasi: '',
  alamat: '',
  thumbnail_foto_banner: null,
  thumbnail_foto_banner_preview: null,
  deleted_files: [],
  file_pendukung: []
})

const goBack = () => {
  router.back()
}

const fetchDetail = async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id)
    const response = await getDetailPengajuanProposal(id)
    if (response.success && response.data) {
      proposal.value = response.data
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat detail proposal'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    })
  } finally {
    loading.value = false
  }
}

const fetchKategori = async () => {
  try {
    const response = await getKategoriProposal()
    if (response.success && response.data) {
      kategoriOptions.value = response.data
    }
  } catch (error) {
  }
}

const enableEditMode = () => {
  if (!proposal.value) return
  
  if (proposal.value.status !== 'menunggu_verifikasi' && proposal.value.status !== 'ditolak') {
    toast.add({
      severity: 'warn',
      summary: 'Peringatan',
      detail: 'Proposal hanya bisa diedit jika status menunggu verifikasi atau ditolak',
      life: 3000
    })
    return
  }

  isEditMode.value = true
  editData.value = {
    kategori_proposal_id: proposal.value.kategori_proposal_id,
    nomor_telepon_pengaju: proposal.value.nomor_telepon_pengaju || '',
    nama_kegiatan: proposal.value.nama_kegiatan,
    deskripsi_kegiatan: proposal.value.deskripsi_kegiatan,
    usulan_anggaran: proposal.value.usulan_anggaran,
    latitude: parseFloat(proposal.value.latitude),
    longitude: parseFloat(proposal.value.longitude),
    nama_lokasi: proposal.value.nama_lokasi,
    alamat: proposal.value.alamat,
    thumbnail_foto_banner: null,
    thumbnail_foto_banner_preview: null,
    deleted_files: [],
    file_pendukung: []
  }
}

const cancelEdit = () => {
  isEditMode.value = false
  editData.value = {
    kategori_proposal_id: null,
    nomor_telepon_pengaju: '',
    nama_kegiatan: '',
    deskripsi_kegiatan: '',
    usulan_anggaran: null,
    latitude: null,
    longitude: null,
    nama_lokasi: '',
    alamat: '',
    thumbnail_foto_banner: null,
    thumbnail_foto_banner_preview: null,
    deleted_files: [],
    file_pendukung: []
  }
}

const saveEdit = async () => {
  if (!proposal.value) return

  saving.value = true
  try {
    const updateData = {
      kategori_proposal_id: editData.value.kategori_proposal_id,
      nomor_telepon_pengaju: editData.value.nomor_telepon_pengaju || undefined,
      nama_kegiatan: editData.value.nama_kegiatan,
      deskripsi_kegiatan: editData.value.deskripsi_kegiatan,
      usulan_anggaran: editData.value.usulan_anggaran,
      latitude: editData.value.latitude,
      longitude: editData.value.longitude,
      nama_lokasi: editData.value.nama_lokasi,
      alamat: editData.value.alamat
    }

    if (editData.value.deleted_files.length > 0) {
      updateData.deleted_files = editData.value.deleted_files
    }

    if (editData.value.file_pendukung.length > 0) {
      updateData.file_pendukung = editData.value.file_pendukung
    }

    if (editData.value.thumbnail_foto_banner) {
      updateData.thumbnail_foto_banner = editData.value.thumbnail_foto_banner
    }

    await updatePengajuanProposal(proposal.value.id, updateData)

    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Proposal berhasil diupdate',
      life: 3000
    })

    isEditMode.value = false
    await fetchDetail()
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal mengupdate proposal'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    })
  } finally {
    saving.value = false
  }
}

const handleDelete = () => {
  if (!proposal.value) return

  confirm.require({
    message: 'Apakah Anda yakin ingin menghapus proposal ini?',
    header: 'Konfirmasi Hapus',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await deletePengajuanProposal(proposal.value.id)
        toast.add({
          severity: 'success',
          summary: 'Berhasil',
          detail: 'Proposal berhasil dihapus',
          life: 3000
        })
        setTimeout(() => {
          router.push('/services/proposal')
        }, 1500)
      } catch (error) {
        const err = error || {}
        const errorMessage = (err.response && err.response.message) || err.message || 'Gagal menghapus proposal'
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000
        })
      }
    }
  })
}

const handleExportPDF = async () => {
  if (!proposal.value) return

  exportingPDF.value = true
  try {
    const blob = await exportPDF(proposal.value.id)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `proposal-${proposal.value.id}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'PDF berhasil diunduh',
      life: 3000
    })
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal mengunduh PDF'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    })
  } finally {
    exportingPDF.value = false
  }
}

const getExistingFiles = () => {
  if (!proposal.value || !proposal.value.file_pendukung) return []
  return proposal.value.file_pendukung.filter((file, index) => {
    return !editData.value.deleted_files.includes(file.path)
  })
}

const getNewFiles = () => {
  return editData.value.file_pendukung || []
}

const removeExistingFile = (index) => {
  const existingFiles = getExistingFiles()
  if (existingFiles[index]) {
    editData.value.deleted_files.push(existingFiles[index].path)
  }
}

const removeNewFile = (index) => {
  editData.value.file_pendukung.splice(index, 1)
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files || [])
  const validFiles = files.filter((file) => {
    const validTypes = ['.pdf', '.doc', '.docx', '.xlsx', '.xls']
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    return validTypes.includes(fileExtension)
  })
  editData.value.file_pendukung = [...editData.value.file_pendukung, ...validFiles]
  event.target.value = ''
}

const handleBannerSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        severity: 'warn',
        summary: 'Peringatan',
        detail: 'Ukuran file maksimal 5MB',
        life: 3000
      })
      return
    }
    if (!file.type.startsWith('image/')) {
      toast.add({
        severity: 'warn',
        summary: 'Peringatan',
        detail: 'File harus berupa gambar',
        life: 3000
      })
      return
    }
    editData.value.thumbnail_foto_banner = file
    const reader = new FileReader()
    reader.onload = (e) => {
      editData.value.thumbnail_foto_banner_preview = e.target.result
    }
    reader.readAsDataURL(file)
  }
  event.target.value = ''
}

const removeBanner = () => {
  editData.value.thumbnail_foto_banner = null
  editData.value.thumbnail_foto_banner_preview = null
}

const onLocationSelected = async (location) => {
  editData.value.latitude = location.lat
  editData.value.longitude = location.lng
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
    )
    const data = await response.json()
    if (data && data.display_name) {
      editData.value.nama_lokasi = data.display_name.split(',')[0]?.trim() || `Lokasi (${location.lat.toFixed(6)}, ${location.lng.toFixed(6)})`
    } else {
      editData.value.nama_lokasi = `Lokasi (${location.lat.toFixed(6)}, ${location.lng.toFixed(6)})`
    }
  } catch (error) {
    editData.value.nama_lokasi = `Lokasi (${location.lat.toFixed(6)}, ${location.lng.toFixed(6)})`
  }
}

const formatStatus = (status) => {
  const statusMap = {
    'menunggu_verifikasi': 'Menunggu Verifikasi',
    'disetujui': 'Disetujui',
    'ditolak': 'Ditolak'
  }
  return statusMap[status] || status
}

const getStatusSeverity = (status) => {
  const severityMap = {
    'menunggu_verifikasi': 'warning',
    'disetujui': 'success',
    'ditolak': 'danger'
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

const formatCurrency = (amount) => {
  if (!amount) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

onMounted(async () => {
  await fetchKategori()
  await fetchDetail()
})
</script>

