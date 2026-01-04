<template>
  <div class="min-h-screen bg-white" :class="isEditMode ? 'pb-24' : 'pb-20'">
    <div class="bg-white sticky top-0 z-10 border-b border-gray-200">
      <div class="px-5 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Button
              icon="pi pi-arrow-left"
              text
              rounded
              @click="goBack"
              class="-ml-2"
            />
            <h1 class="font-semibold text-xl text-gray-800">Detail Surat</h1>
          </div>
          <div v-if="!isEditMode && surat?.status === 'disetujui'" class="flex items-center gap-2">
            <Button
              icon="pi pi-download"
              rounded
              text
              severity="secondary"
              @click="handleExportPDF"
              :loading="exportingPDF"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <ProgressSpinner />
    </div>

    <div v-else-if="surat" class="px-5 py-4 space-y-4" :class="isEditMode ? 'pb-24' : ''">
      <div class="flex items-start gap-4 mb-4">
        <div class="flex-shrink-0">
          <div class="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center bg-primary-100">
            <i class="pi pi-file text-primary-500 text-4xl"></i>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="font-bold text-xl text-gray-800 mb-2">{{ surat.jenis_surat_nama }}</h2>
          <p class="text-sm text-gray-500 mb-3">
            Diajukan pada {{ formatDateTime(surat.created_at) }}
          </p>
          <div class="flex items-center gap-2 flex-wrap">
            <Tag
              :value="formatStatus(surat.status)"
              :severity="getStatusSeverity(surat.status)"
            />
            <Tag
              :value="surat.jenis_surat_kode"
              severity="info"
            />
          </div>
        </div>
      </div>

      <Card class="border border-gray-200">
        <template #content>
          <div class="space-y-3">
            <div class="flex items-start gap-2">
              <i class="pi pi-user text-primary-500 mt-1"></i>
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-1">Pemohon</p>
                <p class="font-medium text-sm text-gray-800">{{ surat.resident_nama }}</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <i class="pi pi-id-card text-primary-500 mt-1"></i>
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-1">NIK</p>
                <p class="font-medium text-sm text-gray-800">{{ surat.resident_nik }}</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <i class="pi pi-calendar text-primary-500 mt-1"></i>
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-1">Tanggal Surat</p>
                <InputText
                  v-if="isEditMode"
                  v-model="editData.tanggal_surat"
                  type="date"
                  class="w-full"
                />
                <p v-else class="font-medium text-sm text-gray-800">{{ formatDate(surat.tanggal_surat) }}</p>
              </div>
            </div>
            <div v-if="surat.nomor_surat" class="flex items-start gap-2">
              <i class="pi pi-hashtag text-primary-500 mt-1"></i>
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-1">Nomor Surat</p>
                <p class="font-medium text-sm text-gray-800">{{ surat.nomor_surat }}</p>
              </div>
            </div>
            <div v-if="surat.tanggal_disetujui" class="flex items-start gap-2">
              <i class="pi pi-check-circle text-primary-500 mt-1"></i>
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-1">Tanggal Disetujui</p>
                <p class="font-medium text-sm text-gray-800">{{ formatDateTime(surat.tanggal_disetujui) }}</p>
              </div>
            </div>
            <div v-if="surat.alasan_penolakan" class="flex items-start gap-2">
              <i class="pi pi-exclamation-triangle text-red-500 mt-1"></i>
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-1">Alasan Penolakan</p>
                <p class="font-medium text-sm text-red-600">{{ surat.alasan_penolakan }}</p>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="surat.atribut_detail && surat.atribut_detail.length > 0" class="border border-gray-200">
        <template #content>
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-base text-gray-800">Data Formulir</h3>
              <Button
                v-if="!isEditMode && surat.can_be_edited"
                icon="pi pi-pencil"
                text
                rounded
                severity="secondary"
                @click="enableEditMode"
                size="small"
              />
            </div>
            <div class="space-y-4">
              <div
                v-for="atribut in surat.atribut_detail"
                :key="atribut.id"
                class="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <p class="text-xs text-gray-500 mb-1">{{ atribut.atribut_nama }}</p>
                
                <InputText
                  v-if="isEditMode && atribut.atribut_tipe === 'text'"
                  :model-value="getAtributValue(atribut.atribut_jenis_surat_id)"
                  @update:model-value="setAtributValue(atribut.atribut_jenis_surat_id, $event)"
                  class="w-full mb-2"
                  :placeholder="`Masukkan ${atribut.atribut_nama.toLowerCase()}`"
                />
                <InputText
                  v-else-if="isEditMode && atribut.atribut_tipe === 'number'"
                  :model-value="getAtributValue(atribut.atribut_jenis_surat_id)"
                  @update:model-value="setAtributValue(atribut.atribut_jenis_surat_id, $event)"
                  type="number"
                  class="w-full mb-2"
                  :placeholder="`Masukkan ${atribut.atribut_nama.toLowerCase()}`"
                />
                <InputText
                  v-else-if="isEditMode && atribut.atribut_tipe === 'date'"
                  :model-value="getAtributValue(atribut.atribut_jenis_surat_id)"
                  @update:model-value="setAtributValue(atribut.atribut_jenis_surat_id, $event)"
                  type="date"
                  class="w-full mb-2"
                />
                <Select
                  v-else-if="isEditMode && atribut.atribut_tipe === 'select'"
                  :model-value="getAtributValue(atribut.atribut_jenis_surat_id)"
                  @update:model-value="setAtributValue(atribut.atribut_jenis_surat_id, $event)"
                  :options="getAtributOptions(atribut.atribut_jenis_surat_id)"
                  class="w-full mb-2"
                  :placeholder="`Pilih ${atribut.atribut_nama.toLowerCase()}`"
                />
                <div v-else-if="isEditMode && atribut.atribut_tipe === 'boolean'" class="mb-2">
                  <Checkbox
                    :model-value="getAtributValue(atribut.atribut_jenis_surat_id)"
                    @update:model-value="setAtributValue(atribut.atribut_jenis_surat_id, $event)"
                    :binary="true"
                  />
                </div>
                <p v-else-if="atribut.nilai" class="font-medium text-sm text-gray-800 mb-2">{{ atribut.nilai }}</p>
                
                <div v-if="(atribut.lampiran_files && atribut.lampiran_files.length > 0) || (isEditMode && getNewFiles(atribut.atribut_jenis_surat_id).length > 0)" class="mt-3">
                  <p class="text-xs text-gray-500 mb-2">Lampiran:</p>
                  <div class="grid grid-cols-2 gap-3">
                    <div
                      v-for="(file, index) in getExistingFiles(atribut.atribut_jenis_surat_id)"
                      :key="`existing-${atribut.atribut_jenis_surat_id}-${index}`"
                      class="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <div
                        class="w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
                        @click="!isEditMode && openImagePreview(file.path, index)"
                      >
                        <NuxtImg
                          :src="file.path"
                          :alt="file.name"
                          class="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <Button
                        v-if="isEditMode"
                        icon="pi pi-times"
                        severity="danger"
                        rounded
                        @click="removeExistingFile(atribut.atribut_jenis_surat_id, file.path)"
                        class="absolute top-2 right-2"
                        size="small"
                      />
                    </div>
                    <div
                      v-for="(file, index) in getNewFiles(atribut.atribut_jenis_surat_id)"
                      :key="`new-${atribut.atribut_jenis_surat_id}-${index}`"
                      class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                    >
                      <img
                        v-if="file"
                        :src="getFilePreview(file)"
                        :alt="file.name || 'Preview'"
                        class="w-full h-full object-cover"
                      />
                      <Button
                        v-if="isEditMode"
                        icon="pi pi-times"
                        severity="danger"
                        rounded
                        @click="removeNewFile(atribut.atribut_jenis_surat_id, index)"
                        class="absolute top-2 right-2"
                        size="small"
                      />
                    </div>
                  </div>
                </div>
                
                <div v-if="isEditMode && getAtributLampiranName(atribut.atribut_jenis_surat_id)" class="mt-3">
                  <label class="text-xs text-gray-500 mb-2 block">
                    {{ getAtributLampiranName(atribut.atribut_jenis_surat_id) }}
                  </label>
                  <FileUpload
                    mode="basic"
                    :multiple="getAtributMinimalFile(atribut.atribut_jenis_surat_id) > 1"
                    :accept="'image/*'"
                    :maxFileSize="5000000"
                    chooseLabel="Pilih File"
                    class="w-full"
                    @select="(event) => handleFileSelect(event, atribut.atribut_jenis_surat_id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <div class="flex gap-3 pt-4">
        <Button
          v-if="!isEditMode && surat.can_be_edited"
          label="Edit"
          icon="pi pi-pencil"
          outlined
          class="flex-1"
          @click="enableEditMode"
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
          v-if="!isEditMode && surat.status === 'disetujui'"
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

    <div v-else class="flex flex-col items-center justify-center min-h-[60vh] px-5">
      <div class="mb-6">
        <div class="w-32 h-32 mx-auto flex items-center justify-center">
          <div class="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg">
            <i class="pi pi-file text-gray-400 text-6xl"></i>
          </div>
        </div>
      </div>
      <p class="text-gray-700 font-medium text-lg mb-8">Surat tidak ditemukan</p>
    </div>

    <Dialog
      v-model:visible="imagePreviewVisible"
      modal
      :style="{ width: '90vw', maxWidth: '600px' }"
      :closable="true"
      class="p-0"
    >
      <template #header>
        <div class="flex items-center justify-between w-full">
          <h3 class="font-semibold text-lg">Preview Gambar</h3>
          <Button
            icon="pi pi-times"
            text
            rounded
            @click="imagePreviewVisible = false"
          />
        </div>
      </template>
      <div class="w-full">
        <img
          v-if="previewImageUrl"
          :src="previewImageUrl"
          alt="Preview"
          class="w-full h-auto max-h-[70vh] object-contain"
        />
      </div>
    </Dialog>

    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { Card, Button, Tag, ProgressSpinner, Dialog, ConfirmDialog, InputText, Select, Checkbox, FileUpload } from 'primevue'
import { useLetter } from '@/composables/useLetter'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const { getDetailPengajuanSurat, deletePengajuanSurat, updatePengajuanSurat, exportPDF, getDetailJenisSurat } = useLetter()

const surat = ref(null)
const loading = ref(false)
const deleting = ref(false)
const saving = ref(false)
const exportingPDF = ref(false)
const imagePreviewVisible = ref(false)
const previewImageUrl = ref('')
const isEditMode = ref(false)
const editData = ref({})
const atributConfig = ref({})

const fetchDetail = async (forceRefresh = false) => {
  loading.value = true
  try {
    const params = forceRefresh ? { _t: Date.now() } : {}
    const response = await getDetailPengajuanSurat(parseInt(route.params.id))
    if (response.success && response.data) {
      surat.value = response.data
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Gagal memuat detail surat',
        life: 3000
      })
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat detail surat'
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

const enableEditMode = async () => {
  if (!surat.value || !surat.value.can_be_edited) return
  
  try {
    const response = await getDetailJenisSurat(surat.value.jenis_surat_id)
    if (response.success && response.data) {
      atributConfig.value = {}
      response.data.atribut.forEach(atribut => {
        atributConfig.value[atribut.id] = atribut
      })
    }
  } catch (error) {
    // Silent error
  }
  
  editData.value = {
    tanggal_surat: surat.value.tanggal_surat,
    atribut: {}
  }
  
  if (surat.value.atribut_detail) {
    surat.value.atribut_detail.forEach(atribut => {
      if (!editData.value.atribut[atribut.atribut_jenis_surat_id]) {
        editData.value.atribut[atribut.atribut_jenis_surat_id] = {
          nilai: atribut.nilai || '',
          deleted_files: [],
          lampiran_files: []
        }
      }
    })
  }
  
  isEditMode.value = true
}

const cancelEdit = () => {
  isEditMode.value = false
  editData.value = {}
  atributConfig.value = {}
}

const getExistingFiles = (atributId) => {
  if (!surat.value || !surat.value.atribut_detail) return []
  const atribut = surat.value.atribut_detail.find(a => a.atribut_jenis_surat_id === atributId)
  if (!atribut || !atribut.lampiran_files) return []
  
  if (!isEditMode.value) {
    return atribut.lampiran_files
  }
  
  const deletedFiles = editData.value?.atribut?.[atributId]?.deleted_files || []
  return atribut.lampiran_files.filter(file => !deletedFiles.includes(file.path))
}

const getNewFiles = (atributId) => {
  if (!isEditMode.value || !editData.value?.atribut) return []
  return editData.value.atribut[atributId]?.lampiran_files || []
}

const getAtributValue = (atributId) => {
  if (!editData.value || !editData.value.atribut || !editData.value.atribut[atributId]) {
    return ''
  }
  return editData.value.atribut[atributId].nilai || ''
}

const setAtributValue = (atributId, value) => {
  if (!editData.value || !editData.value.atribut) {
    editData.value = { atribut: {} }
  }
  if (!editData.value.atribut[atributId]) {
    editData.value.atribut[atributId] = {
      nilai: '',
      deleted_files: [],
      lampiran_files: []
    }
  }
  editData.value.atribut[atributId].nilai = value
}

const getAtributOptions = (atributId) => {
  const config = atributConfig.value[atributId]
  if (!config || !config.opsi_pilihan) return []
  return config.opsi_pilihan
}

const getAtributLampiranName = (atributId) => {
  const config = atributConfig.value[atributId]
  return config?.nama_lampiran || null
}

const getAtributMinimalFile = (atributId) => {
  const config = atributConfig.value[atributId]
  return config?.minimal_file || 0
}

const removeExistingFile = (atributId, filePath) => {
  if (!editData.value || !editData.value.atribut) {
    editData.value = { atribut: {} }
  }
  if (!editData.value.atribut[atributId]) {
    editData.value.atribut[atributId] = {
      nilai: '',
      deleted_files: [],
      lampiran_files: []
    }
  }
  if (!editData.value.atribut[atributId].deleted_files) {
    editData.value.atribut[atributId].deleted_files = []
  }
  editData.value.atribut[atributId].deleted_files.push(filePath)
}

const removeNewFile = (atributId, index) => {
  if (!editData.value || !editData.value.atribut) return
  if (editData.value.atribut[atributId] && editData.value.atribut[atributId].lampiran_files) {
    editData.value.atribut[atributId].lampiran_files.splice(index, 1)
  }
}

const handleFileSelect = (event, atributId) => {
  const files = Array.from(event.files || [])
  if (!editData.value || !editData.value.atribut) {
    editData.value = { atribut: {} }
  }
  if (!editData.value.atribut[atributId]) {
    editData.value.atribut[atributId] = {
      nilai: '',
      deleted_files: [],
      lampiran_files: []
    }
  }
  if (!editData.value.atribut[atributId].lampiran_files) {
    editData.value.atribut[atributId].lampiran_files = []
  }
  editData.value.atribut[atributId].lampiran_files = [
    ...editData.value.atribut[atributId].lampiran_files,
    ...files
  ]
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

const saveEdit = async () => {
  if (!surat.value) return
  
  saving.value = true
  
  try {
    const atributData = {}
    Object.keys(editData.value.atribut).forEach(atributId => {
      const id = parseInt(atributId)
      const data = editData.value.atribut[id]
      
      if (data.nilai !== undefined || (data.deleted_files && data.deleted_files.length > 0) || (data.lampiran_files && data.lampiran_files.length > 0)) {
        atributData[id] = {
          nilai: data.nilai !== undefined ? data.nilai : undefined,
          deleted_files: data.deleted_files && data.deleted_files.length > 0 ? data.deleted_files : undefined,
          lampiran_files: data.lampiran_files && data.lampiran_files.length > 0 ? data.lampiran_files : undefined
        }
      }
    })
    
    const response = await updatePengajuanSurat(surat.value.id, {
      tanggal_surat: editData.value.tanggal_surat,
      atribut: atributData
    })
    
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: response.message || 'Pengajuan surat berhasil diupdate',
        life: 3000
      })
      
      isEditMode.value = false
      editData.value = {}
      atributConfig.value = {}
      
      surat.value = null
      await nextTick()
      
      await new Promise(resolve => setTimeout(resolve, 300))
      await fetchDetail(true)
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal mengupdate pengajuan surat'
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

const handleDelete = () => {
  confirm.require({
    message: 'Apakah Anda yakin ingin menghapus pengajuan surat ini?',
    header: 'Konfirmasi Hapus',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      deleting.value = true
      try {
        await deletePengajuanSurat(parseInt(route.params.id))
        toast.add({
          severity: 'success',
          summary: 'Berhasil',
          detail: 'Pengajuan surat berhasil dihapus',
          life: 3000
        })
        setTimeout(() => {
          router.push('/services/letter')
        }, 1500)
      } catch (error) {
        const err = error || {}
        const errorMessage = (err.response && err.response.message) || err.message || 'Gagal menghapus pengajuan surat'
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 3000
        })
      } finally {
        deleting.value = false
      }
    }
  })
}

const handleExportPDF = async () => {
  exportingPDF.value = true
  try {
    const blob = await exportPDF(parseInt(route.params.id))
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `surat-${surat.value?.nomor_surat || surat.value?.id}.pdf`
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
      life: 3000
    })
  } finally {
    exportingPDF.value = false
  }
}

const openImagePreview = (imageUrl, index = 0) => {
  previewImageUrl.value = imageUrl
  imagePreviewVisible.value = true
}

const formatStatus = (status) => {
  const statusMap = {
    'menunggu': 'Menunggu',
    'diproses': 'Diproses',
    'disetujui': 'Disetujui',
    'ditolak': 'Ditolak',
    'diperbaiki': 'Diperbaiki'
  }
  return statusMap[status] || status
}

const getStatusSeverity = (status) => {
  const severityMap = {
    'menunggu': 'warning',
    'diproses': 'info',
    'disetujui': 'success',
    'ditolak': 'danger',
    'diperbaiki': 'warning'
  }
  return severityMap[status] || null
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchDetail()
})
</script>
