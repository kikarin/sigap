<template>
  <div class="min-h-screen bg-gray-50 pb-6">
    <div class="bg-white sticky top-0 z-10 border-b border-gray-200">
      <div class="px-5 py-4">
        <div class="flex items-center gap-3">
          <Button
            icon="pi pi-arrow-left"
            text
            rounded
            @click="goBack"
            class="-ml-2"
          />
          <h1 class="font-semibold text-xl text-gray-800">Detail Program Bantuan</h1>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <ProgressSpinner />
    </div>

    <div v-else-if="program" class="px-4 py-4">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div class="space-y-4">
          <div>
            <h2 class="font-bold text-xl text-gray-900 mb-4 leading-tight">
              {{ program.program?.nama_program || program.nama_program }}
            </h2>
            
            <div class="flex flex-wrap gap-2">
              <Tag
                :value="program.program?.status_label || formatStatusProgram(program.program?.status || program.status_program)"
                :severity="getStatusProgramSeverity(program.program?.status || program.status_program)"
                class="text-sm"
              />
              <Tag
                :value="program.status_penyaluran_label || formatStatusPenyaluran(program.status_penyaluran)"
                :severity="getStatusPenyaluranSeverity(program.status_penyaluran)"
                class="text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <div class="space-y-4">
            <h3 class="font-semibold text-base text-gray-800 mb-3 flex items-center gap-2">
              <i class="pi pi-info-circle text-primary-500"></i>
              Informasi Program
            </h3>
            <div class="space-y-3 text-sm">
              <div v-if="program.program?.tahun" class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <i class="pi pi-calendar text-primary-500"></i>
                <span class="text-gray-600 flex-1">Tahun:</span>
                <span class="font-medium text-gray-800">{{ program.program.tahun }}</span>
              </div>
              <div v-if="program.program?.periode" class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <i class="pi pi-clock text-primary-500"></i>
                <span class="text-gray-600 flex-1">Periode:</span>
                <span class="font-medium text-gray-800">{{ program.program.periode }}</span>
              </div>
              <div v-if="program.target_type_label" class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <i class="pi pi-users text-primary-500"></i>
                <span class="text-gray-600 flex-1">Tipe Penerima:</span>
                <span class="font-medium text-gray-800">{{ program.target_type_label }}</span>
              </div>
              <div v-if="program.program?.desil_label" class="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                <i class="pi pi-chart-bar text-blue-600"></i>
                <span class="text-gray-600 flex-1">Desil Program:</span>
                <span class="font-semibold text-blue-700">{{ program.program.desil_label }}</span>
              </div>
              <div v-if="program.jadwal_pengambilan" class="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <i class="pi pi-calendar-times text-green-600 mt-0.5"></i>
                <div class="flex-1">
                  <span class="text-gray-600 block mb-1 font-medium">Jadwal Pengambilan:</span>
                  <p class="text-gray-800 text-sm leading-relaxed">
                    <span v-if="program.jadwal_pengambilan.label">{{ program.jadwal_pengambilan.label }}</span>
                    <template v-else>
                      <span v-if="program.jadwal_pengambilan.tanggal">{{ formatDate(program.jadwal_pengambilan.tanggal) }}</span>
                      <span v-if="program.jadwal_pengambilan.jam_mulai && program.jadwal_pengambilan.jam_selesai">
                        <span v-if="program.jadwal_pengambilan.tanggal">, </span>
                        {{ program.jadwal_pengambilan.jam_mulai }} - {{ program.jadwal_pengambilan.jam_selesai }}
                      </span>
                    </template>
                  </p>
                </div>
              </div>
              <div v-if="program.program?.keterangan" class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <i class="pi pi-info-circle text-primary-500 mt-0.5"></i>
                <div class="flex-1">
                  <span class="text-gray-600 block mb-1">Keterangan:</span>
                  <p class="text-gray-800 text-sm leading-relaxed">{{ program.program.keterangan }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="program.family || program.resident" class="bg-white rounded-3xl shadow-lg p-5 mb-4">
          <div class="space-y-4">
            <h3 class="font-semibold text-base text-gray-800 mb-3 flex items-center gap-2">
              <i class="pi pi-user text-primary-500"></i>
              Informasi Penerima
            </h3>
            <div class="space-y-3 text-sm">
              <div v-if="program.family" class="space-y-2">
                <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <i class="pi pi-home text-primary-500"></i>
                  <span class="text-gray-600 flex-1">No. KK:</span>
                  <span class="font-medium text-gray-800">{{ program.family.no_kk }}</span>
                </div>
              </div>
              <div v-if="program.resident" class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <i class="pi pi-user text-primary-500"></i>
                <span class="text-gray-600 flex-1">Nama:</span>
                <span class="font-medium text-gray-800">{{ program.resident.nama }}</span>
              </div>
              <div v-if="program.kepala_keluarga" class="space-y-2">
                <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <i class="pi pi-user text-primary-500"></i>
                  <span class="text-gray-600 flex-1">Kepala Keluarga:</span>
                  <span class="font-medium text-gray-800">{{ program.kepala_keluarga.nama }}</span>
                </div>
                <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <i class="pi pi-id-card text-primary-500"></i>
                  <span class="text-gray-600 flex-1">NIK:</span>
                  <span class="font-medium text-gray-800">{{ program.kepala_keluarga.nik }}</span>
                </div>
              </div>
              <div v-if="program.family?.desil_label" class="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                <i class="pi pi-chart-bar text-blue-600"></i>
                <span class="text-gray-600 flex-1">Desil Keluarga:</span>
                <span class="font-semibold text-blue-700">{{ program.family.desil_label }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="program.penerima_lapangan" class="bg-white rounded-3xl shadow-lg p-5 mb-4">
          <div class="space-y-4">
            <h3 class="font-semibold text-base text-gray-800 mb-3 flex items-center gap-2">
              <i class="pi pi-map-marker text-primary-500"></i>
              Penerima Lapangan
            </h3>
            <div class="space-y-3 text-sm">
              <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <i class="pi pi-user text-primary-500"></i>
                <span class="text-gray-600 flex-1">Nama:</span>
                <span class="font-medium text-gray-800">{{ program.penerima_lapangan.nama }}</span>
              </div>
              <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <i class="pi pi-id-card text-primary-500"></i>
                <span class="text-gray-600 flex-1">NIK:</span>
                <span class="font-medium text-gray-800">{{ program.penerima_lapangan.nik }}</span>
              </div>
              <div v-if="program.tanggal_penyaluran" class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <i class="pi pi-calendar text-primary-500"></i>
                <span class="text-gray-600 flex-1">Tanggal Penyaluran:</span>
                <span class="font-medium text-gray-800">{{ formatDateTime(program.tanggal_penyaluran) }}</span>
              </div>
              <div v-if="program.absen_mandiri" class="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                <i class="pi pi-check-circle text-blue-600"></i>
                <span class="text-gray-600 flex-1">Absen Mandiri:</span>
                <span class="font-semibold text-blue-700">Ya</span>
              </div>
              <div v-if="program.foto_bukti_pengambilan" class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <i class="pi pi-image text-primary-500 mt-0.5"></i>
                <div class="flex-1">
                  <span class="text-gray-600 block mb-2 font-medium">Foto Bukti Pengambilan:</span>
                  <div class="relative">
                    <NuxtImg
                      :src="program.foto_bukti_pengambilan"
                      alt="Foto Bukti Pengambilan"
                      class="w-full max-w-xs rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                      @click="openImageModal(program.foto_bukti_pengambilan)"
                    />
                    <a
                      :href="program.foto_bukti_pengambilan"
                      target="_blank"
                      download
                      class="mt-2 inline-flex items-center gap-2 text-xs text-primary-600 hover:text-primary-700"
                    >
                      <i class="pi pi-download"></i>
                      Download Foto
                    </a>
                  </div>
                </div>
              </div>
              <div v-if="program.catatan" class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <i class="pi pi-file-edit text-primary-500 mt-0.5"></i>
                <div class="flex-1">
                  <span class="text-gray-600 block mb-1">Catatan:</span>
                  <p class="text-gray-800 text-sm leading-relaxed">{{ program.catatan }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="program.program_items && program.program_items.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <div class="space-y-4">
            <h3 class="font-semibold text-base text-gray-800 mb-3 flex items-center gap-2">
              <i class="pi pi-gift text-primary-500"></i>
              Item Bantuan
            </h3>
            <div class="space-y-3">
              <div
                v-for="(item, index) in program.program_items"
                :key="index"
                class="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-100"
              >
                <div class="flex-1">
                  <p class="font-semibold text-gray-800 mb-1">{{ item.nama_item }}</p>
                  <p class="text-xs text-gray-500">{{ item.tipe === 'UANG' ? 'Uang Tunai' : 'Barang' }}</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-primary-600 text-lg">
                    {{ item.tipe === 'UANG' ? formatCurrency(item.jumlah) : `${item.jumlah} ${item.satuan}` }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tombol Absen Mandiri -->
        <div v-if="canAbsenMandiri" class="px-4 pb-4">
          <Button
            label="Absen Mandiri"
            icon="pi pi-check-circle"
            class="w-full"
            size="large"
            @click="openAbsenModal"
          />
        </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center min-h-[60vh] px-5">
      <div class="mb-6">
        <div class="w-32 h-32 mx-auto flex items-center justify-center">
          <div class="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg">
            <i class="pi pi-gift text-gray-400 text-6xl"></i>
          </div>
        </div>
      </div>
      <p class="text-gray-700 font-medium text-lg mb-8">Program bantuan tidak ditemukan</p>
    </div>

    <!-- Image Modal -->
    <Dialog
      v-model:visible="imageModalVisible"
      :modal="true"
      :closable="true"
      :draggable="false"
      :resizable="false"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      :pt="{
        root: { class: 'p-0' },
        content: { class: 'p-0' }
      }"
      @hide="closeImageModal"
    >
      <template #header>
        <div class="flex items-center w-full px-4 py-3 border-b border-gray-200">
          <h3 class="font-semibold text-lg text-gray-800">Foto Bukti Pengambilan</h3>
        </div>
      </template>
      <div v-if="selectedImage" class="flex items-center justify-center bg-gray-100 p-4">
        <NuxtImg
          :src="selectedImage"
          alt="Foto Bukti Pengambilan"
          class="max-w-full max-h-[80vh] object-contain"
        />
      </div>
    </Dialog>

    <!-- Absen Mandiri Dialog -->
    <Dialog
      v-model:visible="absenModalVisible"
      :modal="true"
      :closable="true"
      :draggable="false"
      :resizable="false"
      :style="{ width: '90vw', maxWidth: '500px' }"
      @hide="closeAbsenModal"
    >
      <template #header>
        <div class="flex items-center w-full px-4 py-3 border-b border-gray-200">
          <h3 class="font-semibold text-lg text-gray-800">Absen Mandiri</h3>
        </div>
      </template>
      <div class="px-4 py-4 space-y-4">
        <Message v-if="absenError" severity="error" :closable="false" class="mb-4">
          {{ absenError }}
        </Message>

        <Message severity="info" variant="outlined" :closable="false" class="mb-4">
          <div class="flex items-start gap-2">
            <i class="pi pi-info-circle mt-0.5"></i>
            <div>
              <p class="font-medium mb-1">Absen Mandiri</p>
              <p class="text-sm">Upload foto bukti pengambilan bantuan. Penerima lapangan akan otomatis menggunakan data Anda yang sedang login.</p>
            </div>
          </div>
        </Message>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Foto Bukti Pengambilan <span class="text-red-500">*</span>
          </label>
          <FileUpload
            mode="basic"
            accept="image/*"
            :maxFileSize="5000000"
            chooseLabel="Pilih Foto"
            class="w-full"
            @select="onFileSelect"
            @remove="onFileRemove"
          />
          <Message severity="info" variant="outlined" :closable="false" class="mt-2">
            Format: JPG, PNG (Maks. 5MB)
          </Message>
          <div v-if="absenForm.foto_bukti" class="mt-3">
            <div class="relative inline-block">
              <NuxtImg
                :src="previewImage"
                alt="Preview"
                class="w-full max-w-xs rounded-lg border border-gray-200"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                rounded
                @click="onFileRemove"
                class="absolute top-2 right-2"
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2 justify-end px-4 py-3 border-t border-gray-200">
          <Button
            label="Batal"
            severity="secondary"
            outlined
            @click="closeAbsenModal"
          />
          <Button
            label="Kirim"
            :loading="submittingAbsen"
            @click="submitAbsen"
            :disabled="!canSubmitAbsen"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { Card, Button, Tag, ProgressSpinner, Dialog, FileUpload, Message } from 'primevue'
import { useProgramBantuan } from '@/composables/useProgramBantuan'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const { getDetailRiwayatProgramBantuan, absenMandiri } = useProgramBantuan()

const program = ref(null)
const loading = ref(false)
const imageModalVisible = ref(false)
const selectedImage = ref(null)

// Absen Mandiri
const absenModalVisible = ref(false)
const absenForm = ref({
  foto_bukti: null
})
const previewImage = ref(null)
const submittingAbsen = ref(false)
const absenError = ref('')

const goBack = () => {
  router.back()
}

const openImageModal = (imageUrl) => {
  selectedImage.value = imageUrl
  imageModalVisible.value = true
}

const closeImageModal = () => {
  imageModalVisible.value = false
  selectedImage.value = null
}

const canAbsenMandiri = computed(() => {
  if (!program.value) return false
  const status = program.value.program?.status || program.value.status_program
  return status === 'PENYALURAN' && !program.value.absen_mandiri
})

const canSubmitAbsen = computed(() => {
  // Hanya perlu foto bukti
  return !!absenForm.value.foto_bukti
})

const openAbsenModal = () => {
  absenModalVisible.value = true
  absenError.value = ''
  absenForm.value = {
    foto_bukti: null
  }
  previewImage.value = null
}

const closeAbsenModal = () => {
  absenModalVisible.value = false
  absenForm.value = {
    foto_bukti: null
  }
  previewImage.value = null
  absenError.value = ''
}

const onFileSelect = (event) => {
  const file = event.files?.[0]
  if (file) {
    absenForm.value.foto_bukti = file
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const onFileRemove = () => {
  absenForm.value.foto_bukti = null
  previewImage.value = null
}

const submitAbsen = async () => {
  if (!absenForm.value.foto_bukti) {
    absenError.value = 'Foto bukti harus diisi'
    return
  }

  submittingAbsen.value = true
  absenError.value = ''

  try {
    const id = parseInt(route.params.id)
    const response = await absenMandiri(id, absenForm.value.foto_bukti)

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: 'Absen mandiri berhasil dikirim',
        life: 3000
      })
      closeAbsenModal()
      // Refresh data
      await fetchDetail()
    } else {
      absenError.value = response.message || 'Gagal melakukan absen mandiri'
    }
  } catch (error) {
    const err = error || {}
    
    // Handle validation errors from backend
    if (err.response && err.response.errors) {
      const errors = Object.values(err.response.errors).flat()
      absenError.value = errors.join(', ') || err.response.message || 'Validasi gagal'
    } else {
      const errorMessage = (err.response && err.response.message) || err.message || 'Gagal melakukan absen mandiri'
      absenError.value = errorMessage
    }
  } finally {
    submittingAbsen.value = false
  }
}

const fetchDetail = async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id)
    const response = await getDetailRiwayatProgramBantuan(id)
    if (response.success && response.data) {
      program.value = response.data
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat detail program bantuan'
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

const formatStatusProgram = (status) => {
  const statusMap = {
    'PROSES': 'Proses',
    'PENYALURAN': 'Penyaluran',
    'SELESAI': 'Selesai'
  }
  return statusMap[status] || status
}

const getStatusProgramSeverity = (status) => {
  const severityMap = {
    'PROSES': 'warning',
    'PENYALURAN': 'info',
    'SELESAI': 'success'
  }
  return severityMap[status] || null
}

const formatStatusPenyaluran = (status) => {
  const statusMap = {
    'PROSES': 'Proses',
    'DATANG': 'Datang',
    'TIDAK_DATANG': 'Tidak Datang'
  }
  return statusMap[status] || status
}

const getStatusPenyaluranSeverity = (status) => {
  const severityMap = {
    'PROSES': 'warning',
    'DATANG': 'success',
    'TIDAK_DATANG': 'danger'
  }
  return severityMap[status] || null
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

onMounted(() => {
  fetchDetail()
})
</script>

