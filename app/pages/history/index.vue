<template>
  <div class="min-h-screen bg-white pb-20">
    <div class="bg-white sticky top-0 z-10 border-b border-gray-200">
      <div class="px-5 py-4">
        <div class="flex items-center gap-3">
          <h1 class="font-semibold text-xl text-gray-800">Riwayat</h1>
        </div>
      </div>
      
      <div class="px-5 pb-3">
        <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            v-for="filter in filterTabs"
            :key="filter.value"
            @click="selectedFilter = filter.value"
            class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            :class="
              selectedFilter === filter.value
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            "
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <ProgressSpinner />
    </div>

    <template v-else>
      <div v-if="filteredHistoryList.length > 0" class="px-5 py-4 space-y-4">
        <Card
          v-for="item in filteredHistoryList"
          :key="`${item.type}-${item.id}`"
          class="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
          @click="viewDetail(item)"
        >
          <template #content>
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                <div class="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center">
                  <NuxtImg
                    :src="getItemIcon(item.type)"
                    alt="Icon"
                    class="w-12 h-12 object-contain"
                  />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-400 mb-1">
                  {{ getItemTypeLabel(item.type) }}
                </p>
                <h3 class="font-bold text-base text-gray-800 mb-1 line-clamp-1">
                  {{ getItemTitle(item) }}
                </h3>
                <p class="text-xs text-gray-500 mb-2">
                  Diajukan pada {{ formatDate(item.created_at) }}
                </p>
                <Tag
                  :value="getItemStatus(item)"
                  :severity="getItemStatusSeverity(item)"
                  class="text-xs"
                />
              </div>
              <i class="pi pi-angle-right text-primary-500 flex-shrink-0 mt-1 text-xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div v-else class="flex flex-col items-center justify-center min-h-[60vh] px-5">
        <div class="mb-6">
          <div class="w-32 h-32 mx-auto flex items-center justify-center">
            <div class="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg">
              <i class="pi pi-history text-gray-400 text-6xl"></i>
            </div>
          </div>
        </div>
        
        <p class="text-gray-700 font-medium text-lg mb-8">
          {{ selectedFilter === 'all' ? 'Tidak ada Riwayat' : `Tidak ada Riwayat ${getFilterLabel(selectedFilter)}` }}
        </p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, Tag, ProgressSpinner } from 'primevue'
import { useAduan } from '@/composables/useAduan'
import { useLetter } from '@/composables/useLetter'
import { useProposal } from '@/composables/useProposal'
import { useProgramBantuan } from '@/composables/useProgramBantuan'

const router = useRouter()
const { getListAduan } = useAduan()
const { getListPengajuanSurat } = useLetter()
const { getListPengajuanProposal } = useProposal()
const { getListRiwayatProgramBantuan } = useProgramBantuan()

const historyList = ref([])
const loading = ref(false)
const selectedFilter = ref('all')

const filterTabs = [
  { value: 'all', label: 'Semua' },
  { value: 'aduan', label: 'Aduan' },
  { value: 'surat', label: 'Surat' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'bantuan', label: 'Bantuan' }
]

const filteredHistoryList = computed(() => {
  if (selectedFilter.value === 'all') {
    return historyList.value
  }
  return historyList.value.filter(item => item.type === selectedFilter.value)
})

const getFilterLabel = (value) => {
  const filter = filterTabs.find(f => f.value === value)
  return filter ? filter.label : ''
}

const fetchHistory = async () => {
  loading.value = true

  try {
    const [aduanResponse, suratResponse, proposalResponse, programBantuanResponse] = await Promise.all([
      getListAduan({ page: 0, per_page: 3 }).catch(() => ({ success: false, data: [] })),
      getListPengajuanSurat({ page: 0, per_page: 3 }).catch(() => ({ success: false, data: [] })),
      getListPengajuanProposal({ page: 0, per_page: 3 }).catch(() => ({ success: false, data: [] })),
      getListRiwayatProgramBantuan({ page: 0, per_page: 3 }).catch(() => ({ success: false, data: [] }))
    ])

    const allHistory = []

    // Aduan Masyarakat
    if (aduanResponse && aduanResponse.success) {
      const aduanData = Array.isArray(aduanResponse.data) ? aduanResponse.data : []
      aduanData.forEach(item => {
        allHistory.push({
          ...item,
          type: 'aduan',
          route: `/services/aduan/complaint/masyarakat/${item.id}`
        })
      })
    }

    // Layanan Surat
    if (suratResponse && suratResponse.success) {
      const suratData = Array.isArray(suratResponse.data) ? suratResponse.data : []
      suratData.forEach(item => {
        allHistory.push({
          ...item,
          type: 'surat',
          route: `/services/letter/${item.id}`
        })
      })
    }

    // Pengajuan Proposal
    if (proposalResponse && proposalResponse.success) {
      const proposalData = Array.isArray(proposalResponse.data) ? proposalResponse.data : []
      proposalData.forEach(item => {
        allHistory.push({
          ...item,
          type: 'proposal',
          route: `/services/proposal/${item.id}`
        })
      })
    }

    // Program Bantuan
    if (programBantuanResponse && programBantuanResponse.success) {
      const programBantuanData = Array.isArray(programBantuanResponse.data) ? programBantuanResponse.data : []
      programBantuanData.forEach(item => {
        allHistory.push({
          ...item,
          type: 'bantuan',
          route: `/services/program-bantuan/${item.id}`
        })
      })
    }

    // Sort by created_at descending (newest first)
    allHistory.sort((a, b) => {
      const dateA = new Date(a.created_at || 0)
      const dateB = new Date(b.created_at || 0)
      return dateB - dateA
    })

    historyList.value = allHistory
  } catch (error) {
    console.error('Error fetching history:', error)
  } finally {
    loading.value = false
  }
}

const getItemIcon = (type) => {
  const iconMap = {
    'aduan': '/marketing.png',
    'surat': '/email-and-file.png',
    'proposal': '/business-report.png',
    'bantuan': '/hold-rupiah-coin.png'
  }
  return iconMap[type] || '/marketing.png'
}

const getItemTypeLabel = (type) => {
  const labelMap = {
    'aduan': 'Aduan Masyarakat',
    'surat': 'Layanan Surat',
    'proposal': 'Pengajuan Proposal',
    'bantuan': 'Program Bantuan'
  }
  return labelMap[type] || 'Layanan'
}

const getItemTitle = (item) => {
  if (item.type === 'aduan') {
    return item.judul || 'Aduan Masyarakat'
  }
  if (item.type === 'surat') {
    return item.jenis_surat_nama || 'Layanan Surat'
  }
  if (item.type === 'proposal') {
    return item.nama_kegiatan || 'Pengajuan Proposal'
  }
  if (item.type === 'bantuan') {
    return `${item.nama_program || 'Program Bantuan'} (${item.tahun || ''} - ${item.periode || ''})`.trim()
  }
  return item.title || item.judul || 'Item'
}

const getItemStatus = (item) => {
  if (item.type === 'aduan') {
    const statusMap = {
      'menunggu_verifikasi': 'Menunggu Verifikasi',
      'diverifikasi': 'Diverifikasi',
      'ditolak': 'Ditolak',
      'diproses': 'Sedang diproses',
      'selesai': 'Selesai'
    }
    return statusMap[item.status] || item.status_label || item.status || 'Menunggu'
  }
  if (item.type === 'surat') {
    const statusMap = {
      'menunggu': 'Menunggu',
      'diproses': 'Diproses',
      'disetujui': 'Disetujui',
      'ditolak': 'Ditolak',
      'diperbaiki': 'Diperbaiki'
    }
    return item.status_label || statusMap[item.status] || item.status || 'Menunggu'
  }
  if (item.type === 'proposal') {
    const statusMap = {
      'menunggu_verifikasi': 'Menunggu Verifikasi',
      'disetujui': 'Disetujui',
      'ditolak': 'Ditolak'
    }
    return item.status_label || statusMap[item.status] || item.status || 'Menunggu'
  }
  if (item.type === 'bantuan') {
    // Untuk program bantuan, kita tampilkan status penyaluran sebagai status utama
    const statusMap = {
      'PROSES': 'Proses',
      'DATANG': 'Datang',
      'TIDAK_DATANG': 'Tidak Datang'
    }
    return item.status_penyaluran_label || statusMap[item.status_penyaluran] || 'Proses'
  }
  return item.status_label || item.status || 'Menunggu'
}

const getItemStatusSeverity = (item) => {
  if (item.type === 'aduan') {
    const severityMap = {
      'menunggu_verifikasi': 'warning',
      'diverifikasi': 'info',
      'ditolak': 'danger',
      'diproses': 'secondary',
      'selesai': 'success'
    }
    return severityMap[item.status] || null
  }
  if (item.type === 'surat') {
    const severityMap = {
      'menunggu': 'warning',
      'diproses': 'info',
      'disetujui': 'success',
      'ditolak': 'danger',
      'diperbaiki': 'warning'
    }
    return severityMap[item.status] || 'info'
  }
  if (item.type === 'proposal') {
    const severityMap = {
      'menunggu_verifikasi': 'warning',
      'disetujui': 'success',
      'ditolak': 'danger'
    }
    return severityMap[item.status] || 'warning'
  }
  if (item.type === 'bantuan') {
    const severityMap = {
      'PROSES': 'warning',
      'DATANG': 'success',
      'TIDAK_DATANG': 'danger'
    }
    return severityMap[item.status_penyaluran] || 'warning'
  }
  return 'info'
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

const viewDetail = (item) => {
  if (item.route) {
    router.push(item.route)
  }
}

onMounted(() => {
  fetchHistory()
})
</script>
