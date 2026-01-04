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
          <h1 class="font-semibold text-xl text-gray-800">Layanan Surat</h1>
        </div>
      </div>
      
      <div class="px-5 pb-3">
        <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            v-for="category in filterCategories"
            :key="category.id"
            @click="selectedCategory = category.id"
            class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            :class="
              selectedCategory === category.id
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            "
          >
            {{ category.label }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <ProgressSpinner />
    </div>

    <template v-else>
      <div v-if="suratList.length > 0" class="px-5 py-4 space-y-4">
        <Card
          v-for="surat in suratList"
          :key="surat.id"
          class="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
          @click="viewDetail(surat.id)"
        >
          <template #content>
            <div class="space-y-3">
              <div>
                <h3 class="font-bold text-base text-gray-800 mb-2 line-clamp-2">
                  {{ surat.jenis_surat_nama }}
                </h3>
                <div class="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
                  <span>{{ formatTimeAgo(surat.created_at) }}</span>
                  <span v-if="surat.status">•</span>
                  <Tag
                    v-if="surat.status"
                    :value="formatStatus(surat.status)"
                    :severity="getStatusSeverity(surat.status)"
                    class="text-xs"
                  />
                </div>
              </div>
              
              <div v-if="surat.resident_nama" class="flex items-center justify-between pt-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <i class="pi pi-user text-gray-500 text-sm"></i>
                  </div>
                  <span class="text-sm text-gray-700">{{ surat.resident_nama }}</span>
                </div>
                <div v-if="surat.nomor_surat" class="text-xs text-gray-500">
                  No: {{ surat.nomor_surat }}
                </div>
              </div>
            </div>
          </template>
        </Card>

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
              <i class="pi pi-file text-gray-400 text-6xl"></i>
            </div>
          </div>
        </div>
        
        <p class="text-gray-700 font-medium text-lg mb-8">Tidak ada Surat</p>
      </div>
    </template>

    <div class="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-20">
      <Button
        label="Buat Surat"
        icon="pi pi-plus"
        class="shadow-lg"
        rounded
        size="large"
        @click="router.push('/services/letter/category')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Card, Button, Tag, ProgressSpinner } from 'primevue'
import { useLetter } from '@/composables/useLetter'

const router = useRouter()
const toast = useToast()
const { getJenisSurat, getListPengajuanSurat } = useLetter()

const suratList = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const currentPage = ref(0)
const perPage = ref(10)
const hasMore = ref(false)
const selectedCategory = ref(null)
const kategoriList = ref([])
const meta = ref({})

const filterCategories = computed(() => {
  const all = [{ id: null, label: 'Semua' }]
  return [...all, ...kategoriList.value.map(kat => ({
    id: kat.value,
    label: kat.label
  }))]
})

const goBack = () => {
  router.back()
}

const fetchKategori = async () => {
  try {
    const response = await getJenisSurat()
    if (response.success && response.data) {
      kategoriList.value = response.data
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat kategori'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 3000
    })
  }
}

const fetchSurat = async (page = 0, append = false) => {
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

    if (selectedCategory.value) {
      params.filter_jenis_surat_id = selectedCategory.value
    }

    const response = await getListPengajuanSurat(params)
    
    if (response && response.success) {
      if (response.data && Array.isArray(response.data)) {
        if (append) {
          suratList.value = [...suratList.value, ...response.data]
        } else {
          suratList.value = response.data
        }
        
        meta.value = response.meta || {}
        hasMore.value = meta.value.current_page < Math.ceil(meta.value.total / meta.value.per_page)
      } else {
        suratList.value = []
      }
    } else {
      suratList.value = []
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat data surat'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    })
    suratList.value = []
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  if (hasMore.value && !loadingMore.value) {
    const nextPage = currentPage.value + 1
    fetchSurat(nextPage, true)
    currentPage.value = nextPage
  }
}

const viewDetail = (id) => {
  router.push(`/services/letter/${id}`)
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

watch(selectedCategory, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    currentPage.value = 0
    suratList.value = []
    fetchSurat(0, false)
  }
})

onMounted(async () => {
  await fetchKategori()
  fetchSurat()
})
</script>
