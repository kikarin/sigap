<template>
  <div class="min-h-screen bg-white pb-20">
    <div class="bg-white sticky top-0 z-10 border-b border-gray-200">
      <div class="px-5 py-4">
        <div class="flex items-center gap-3">
          <h1 class="font-semibold text-xl text-gray-800">Riwayat</h1>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <ProgressSpinner />
    </div>

    <template v-else>
      <div v-if="historyList.length > 0" class="px-5 py-4 space-y-4">
        <Card
          v-for="item in historyList"
          :key="item.id"
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
        
        <p class="text-gray-700 font-medium text-lg mb-8">Tidak ada Riwayat</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Card, Tag, ProgressSpinner } from 'primevue'

const router = useRouter()
const { getListAduan } = useAduan()

const historyList = ref([])
const loading = ref(false)

const fetchHistory = async () => {
  loading.value = true

  try {
    const aduanResponse = await getListAduan({
      page: 0,
      per_page: -1
    })

    if (aduanResponse && aduanResponse.success) {
      const aduanData = Array.isArray(aduanResponse.data) ? aduanResponse.data : []
      
      historyList.value = aduanData.map(item => ({
        ...item,
        type: 'aduan',
        route: `/services/complaint/masyarakat/${item.id}`
      }))
    }
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

const getItemTitle = (item) => {
  if (item.type === 'aduan') {
    return item.judul || 'Aduan Masyarakat'
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
    return statusMap[item.status] || item.status || 'Menunggu'
  }
  return item.status || 'Menunggu'
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
