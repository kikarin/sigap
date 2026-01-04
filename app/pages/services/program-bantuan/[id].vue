<template>
  <div class="min-h-screen bg-white pb-20">
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

    <div v-else-if="program" class="px-5 py-4 space-y-4">
      <Card class="border border-gray-200">
        <template #content>
          <div class="space-y-4">
            <div>
              <h2 class="font-bold text-xl text-gray-800 mb-4">{{ program.program?.nama_program || program.nama_program }}</h2>
              
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600 mb-2">Status Program Bantuan</p>
                  <Tag
                    :value="program.program?.status_label || formatStatusProgram(program.program?.status || program.status_program)"
                    :severity="getStatusProgramSeverity(program.program?.status || program.status_program)"
                    class="text-sm"
                  />
                </div>
                
                <div>
                  <p class="text-sm text-gray-600 mb-2">Status Kehadiran</p>
                  <Tag
                    :value="program.status_penyaluran_label || formatStatusPenyaluran(program.status_penyaluran)"
                    :severity="getStatusPenyaluranSeverity(program.status_penyaluran)"
                    class="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card class="border border-gray-200">
        <template #content>
          <div class="space-y-3">
            <h3 class="font-semibold text-base text-gray-800 mb-3">Informasi Program</h3>
            <div class="space-y-2 text-sm">
              <div v-if="program.program?.tahun" class="flex items-center gap-2">
                <i class="pi pi-calendar text-gray-400"></i>
                <span class="text-gray-600">Tahun:</span>
                <span class="font-medium text-gray-800">{{ program.program.tahun }}</span>
              </div>
              <div v-if="program.program?.periode" class="flex items-center gap-2">
                <i class="pi pi-clock text-gray-400"></i>
                <span class="text-gray-600">Periode:</span>
                <span class="font-medium text-gray-800">{{ program.program.periode }}</span>
              </div>
              <div v-if="program.target_type_label" class="flex items-center gap-2">
                <i class="pi pi-users text-gray-400"></i>
                <span class="text-gray-600">Tipe Penerima:</span>
                <span class="font-medium text-gray-800">{{ program.target_type_label }}</span>
              </div>
              <div v-if="program.program?.keterangan" class="flex items-start gap-2">
                <i class="pi pi-info-circle text-gray-400 mt-1"></i>
                <div class="flex-1">
                  <span class="text-gray-600">Keterangan:</span>
                  <p class="text-gray-800 mt-1">{{ program.program.keterangan }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="program.family || program.resident" class="border border-gray-200">
        <template #content>
          <div class="space-y-3">
            <h3 class="font-semibold text-base text-gray-800 mb-3">Informasi Penerima</h3>
            <div class="space-y-2 text-sm">
              <div v-if="program.family" class="space-y-2">
                <div class="flex items-center gap-2">
                  <i class="pi pi-home text-gray-400"></i>
                  <span class="text-gray-600">No. KK:</span>
                  <span class="font-medium text-gray-800">{{ program.family.no_kk }}</span>
                </div>
              </div>
              <div v-if="program.resident" class="flex items-center gap-2">
                <i class="pi pi-user text-gray-400"></i>
                <span class="text-gray-600">Nama:</span>
                <span class="font-medium text-gray-800">{{ program.resident.nama }}</span>
              </div>
              <div v-if="program.kepala_keluarga" class="space-y-2">
                <div class="flex items-center gap-2">
                  <i class="pi pi-user text-gray-400"></i>
                  <span class="text-gray-600">Kepala Keluarga:</span>
                  <span class="font-medium text-gray-800">{{ program.kepala_keluarga.nama }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-id-card text-gray-400"></i>
                  <span class="text-gray-600">NIK:</span>
                  <span class="font-medium text-gray-800">{{ program.kepala_keluarga.nik }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="program.penerima_lapangan" class="border border-gray-200">
        <template #content>
          <div class="space-y-3">
            <h3 class="font-semibold text-base text-gray-800 mb-3">Penerima Lapangan</h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <i class="pi pi-user text-gray-400"></i>
                <span class="text-gray-600">Nama:</span>
                <span class="font-medium text-gray-800">{{ program.penerima_lapangan.nama }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="pi pi-id-card text-gray-400"></i>
                <span class="text-gray-600">NIK:</span>
                <span class="font-medium text-gray-800">{{ program.penerima_lapangan.nik }}</span>
              </div>
              <div v-if="program.tanggal_penyaluran" class="flex items-center gap-2">
                <i class="pi pi-calendar text-gray-400"></i>
                <span class="text-gray-600">Tanggal Penyaluran:</span>
                <span class="font-medium text-gray-800">{{ formatDateTime(program.tanggal_penyaluran) }}</span>
              </div>
              <div v-if="program.catatan" class="flex items-start gap-2">
                <i class="pi pi-file-edit text-gray-400 mt-1"></i>
                <div class="flex-1">
                  <span class="text-gray-600">Catatan:</span>
                  <p class="text-gray-800 mt-1">{{ program.catatan }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="program.program_items && program.program_items.length > 0" class="border border-gray-200">
        <template #content>
          <div class="space-y-3">
            <h3 class="font-semibold text-base text-gray-800 mb-3">Item Bantuan</h3>
            <div class="space-y-3">
              <div
                v-for="(item, index) in program.program_items"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex-1">
                  <p class="font-medium text-gray-800">{{ item.nama_item }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ item.tipe === 'UANG' ? 'Uang Tunai' : 'Barang' }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-primary-500">
                    {{ item.tipe === 'UANG' ? formatCurrency(item.jumlah) : `${item.jumlah} ${item.satuan}` }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { Card, Button, Tag, ProgressSpinner } from 'primevue'
import { useProgramBantuan } from '@/composables/useProgramBantuan'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const { getDetailRiwayatProgramBantuan } = useProgramBantuan()

const program = ref(null)
const loading = ref(false)

const goBack = () => {
  router.back()
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
    'SELESAI': 'Selesai'
  }
  return statusMap[status] || status
}

const getStatusProgramSeverity = (status) => {
  const severityMap = {
    'PROSES': 'warning',
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

