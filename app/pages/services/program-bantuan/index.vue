<template>
  <div class="min-h-screen bg-white pb-32">
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
          <h1 class="font-semibold text-xl text-gray-800">Riwayat Program Bantuan</h1>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <ProgressSpinner />
    </div>

    <template v-else>
      <div v-if="programList.length > 0" class="px-5 py-4 space-y-3">
        <div
          v-for="program in programList"
          :key="program.id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary-200"
          @click="viewDetail(program.id)"
        >
          <div class="space-y-3">
            <div>
              <h3 class="font-bold text-base text-gray-900 mb-2 line-clamp-2 leading-tight">
                {{ program.nama_program }}
              </h3>
              <div class="flex items-center gap-2 text-xs text-gray-500 mb-3 flex-wrap">
                <span>{{ formatTimeAgo(program.created_at) }}</span>
                <span v-if="program.status_program">•</span>
                <Tag
                  v-if="program.status_program"
                  :value="program.status_program_label || formatStatusProgram(program.status_program)"
                  :severity="getStatusProgramSeverity(program.status_program)"
                  class="text-xs"
                />
                <span v-if="program.status_penyaluran">•</span>
                <Tag
                  v-if="program.status_penyaluran"
                  :value="program.status_penyaluran_label || formatStatusPenyaluran(program.status_penyaluran)"
                  :severity="getStatusPenyaluranSeverity(program.status_penyaluran)"
                  class="text-xs"
                />
              </div>
            </div>
            
            <div class="space-y-2 text-sm">
              <div v-if="program.tahun" class="flex items-center gap-2 text-gray-600">
                <i class="pi pi-calendar text-primary-500 text-xs"></i>
                <span class="text-xs">Tahun: <span class="font-medium text-gray-800">{{ program.tahun }}</span></span>
              </div>
              <div v-if="program.periode" class="flex items-center gap-2 text-gray-600">
                <i class="pi pi-clock text-primary-500 text-xs"></i>
                <span class="text-xs">Periode: <span class="font-medium text-gray-800">{{ program.periode }}</span></span>
              </div>
              <div v-if="program.target_type_label" class="flex items-center gap-2 text-gray-600">
                <i class="pi pi-users text-primary-500 text-xs"></i>
                <span class="text-xs">Tipe: <span class="font-medium text-gray-800">{{ program.target_type_label }}</span></span>
              </div>
              <div v-if="program.desil_program?.label" class="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                <i class="pi pi-chart-bar text-blue-600 text-xs"></i>
                <span class="text-xs text-gray-600">Desil Program: <span class="font-semibold text-blue-700">{{ program.desil_program.label }}</span></span>
              </div>
              <div v-if="program.desil_keluarga_label" class="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                <i class="pi pi-home text-blue-600 text-xs"></i>
                <span class="text-xs text-gray-600">Desil Keluarga: <span class="font-semibold text-blue-700">{{ program.desil_keluarga_label }}</span></span>
              </div>
              <div v-if="program.jadwal_pengambilan?.label" class="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                <i class="pi pi-calendar-times text-green-600 text-xs"></i>
                <span class="text-xs text-gray-600">Jadwal: <span class="font-semibold text-green-700">{{ program.jadwal_pengambilan.label }}</span></span>
              </div>
              <div v-if="program.tanggal_penyaluran" class="flex items-center gap-2 text-gray-600">
                <i class="pi pi-check-circle text-primary-500 text-xs"></i>
                <span class="text-xs">Tanggal Penyaluran: <span class="font-medium text-gray-800">{{ formatDate(program.tanggal_penyaluran) }}</span></span>
              </div>
              <div v-if="program.penerima_lapangan_nama" class="flex items-center gap-2 text-gray-600">
                <i class="pi pi-user text-primary-500 text-xs"></i>
                <span class="text-xs">Penerima: <span class="font-medium text-gray-800">{{ program.penerima_lapangan_nama }}</span></span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="hasMore" class="flex justify-center py-4">
          <Button
            label="Muat Lebih Banyak"
            outlined
            :loading="loadingMore"
            @click="loadMore"
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
        
        <p class="text-gray-700 font-medium text-lg mb-8">Tidak ada Program Bantuan</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { Card, Button, Tag, ProgressSpinner } from 'primevue'
import { useProgramBantuan } from '@/composables/useProgramBantuan'

const router = useRouter()
const toast = useToast()
const { getListRiwayatProgramBantuan } = useProgramBantuan()

const programList = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const currentPage = ref(0)
const perPage = ref(10)
const hasMore = ref(false)
const meta = ref({})

const goBack = () => {
  router.back()
}

const fetchProgram = async (page = 0, append = false) => {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const params = {
      page,
      per_page: perPage.value
    }

    const response = await getListRiwayatProgramBantuan(params)
    if (response.success && response.data) {
      if (append) {
        programList.value = [...programList.value, ...response.data]
      } else {
        programList.value = response.data
      }
      
      meta.value = response.meta || {}
      hasMore.value = meta.value.current_page < Math.ceil(meta.value.total / meta.value.per_page)
    } else {
      programList.value = []
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat data program bantuan'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    })
    programList.value = []
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  if (hasMore.value && !loadingMore.value) {
    const nextPage = currentPage.value + 1
    fetchProgram(nextPage, true)
    currentPage.value = nextPage
  }
}

const viewDetail = (id) => {
  router.push(`/services/program-bantuan/${id}`)
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

const formatTimeAgo = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Baru saja'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} minggu yang lalu`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} bulan yang lalu`
  }
  
  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} tahun yang lalu`
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

onMounted(() => {
  fetchProgram()
})
</script>

