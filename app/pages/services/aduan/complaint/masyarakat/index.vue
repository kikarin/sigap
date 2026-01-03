<template>
  <div class="min-h-screen bg-white pb-32">
    <div class="bg-white sticky top-0 z-10 border-b border-gray-200">
      <div class="px-5 py-4">
        <div class="flex items-center gap-3">
          <button
            @click="goBack"
            class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors -ml-2"
          >
            <i class="pi pi-arrow-left text-gray-700 text-xl"></i>
          </button>
          <h1 class="font-semibold text-xl text-gray-800">Aduan Masyarakat</h1>
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
      <div v-if="aduanList.length > 0" class="px-5 py-4 space-y-4">
        <Card
          v-for="aduan in aduanList"
          :key="aduan.id"
          class="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
          @click="viewDetail(aduan.id)"
        >
          <template #content>
            <div class="space-y-3">
              <div>
                <h3 class="font-bold text-base text-gray-800 mb-2 line-clamp-2">
                  {{ aduan.judul }}
                </h3>
                <div class="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
                  <span>{{ formatTimeAgo(aduan.tanggal || aduan.created_at) }}</span>
                  <span v-if="aduan.jenis_aduan">•</span>
                  <span v-if="aduan.jenis_aduan">{{ aduan.jenis_aduan === 'publik' ? 'Public' : 'Private' }}</span>
                  <span v-if="aduan.status">•</span>
                  <Tag
                    v-if="aduan.status"
                    :value="formatStatus(aduan.status)"
                    :severity="getStatusSeverity(aduan.status)"
                    class="text-xs"
                  />
                </div>
              </div>
              
              <div v-if="aduan.foto" class="w-full rounded-lg overflow-hidden">
                <NuxtImg
                  :src="aduan.foto"
                  :alt="aduan.judul"
                  class="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>
              
              <div v-if="aduan.pelapor" class="flex items-center justify-between pt-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <i class="pi pi-user text-gray-500 text-sm"></i>
                  </div>
                  <span class="text-sm text-gray-700">{{ aduan.pelapor }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <button
                    @click.stop="handleShare(aduan)"
                    class="text-gray-500 hover:text-primary-500 transition-colors"
                  >
                    <i class="pi pi-share-alt"></i>
                  </button>
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
        
        <p class="text-gray-700 font-medium text-lg mb-8">Tidak ada Aduan</p>
      </div>
    </template>

    <div class="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-20">
      <Button
        label="Buat Aduan"
        icon="pi pi-plus"
        class="shadow-lg"
        rounded
        size="large"
        @click="router.push('/services/aduan/complaint/category')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Card, Button, Tag, ProgressSpinner } from 'primevue'

const router = useRouter()
const toast = useToast()
const { getListAduan, getKategoriAduan } = useAduan()

const aduanList = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const currentPage = ref(0)
const hasMore = ref(false)
const meta = ref(null)
const selectedCategory = ref('semua')
const kategoriList = ref([])

const filterCategories = computed(() => {
  const categories = [
    { id: 'semua', label: 'Semua' }
  ]
  
  kategoriList.value.forEach(kat => {
    categories.push({
      id: kat.id,
      label: kat.name
    })
  })
  
  return categories
})

const goBack = () => {
  router.back()
}

const fetchKategori = async () => {
  try {
    const response = await getKategoriAduan()
    if (response.success && response.data) {
      kategoriList.value = response.data.map(item => ({
        id: item.value,
        name: item.label
      }))
    }
  } catch (error) {
    console.error('Error fetching kategori:', error)
  }
}

const fetchAduan = async (page = 0, append = false) => {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const params = {
      page: page || 0,
      per_page: selectedCategory.value === 'semua' ? 10 : -1
    }

    const response = await getListAduan(params)

    if (response && response.success) {
      let data = Array.isArray(response.data) ? response.data : []
      
      if (selectedCategory.value !== 'semua') {
        const selectedKategori = kategoriList.value.find(k => k.id === selectedCategory.value)
        if (selectedKategori) {
          data = data.filter(item => {
            const kategoriNama = item.kategori_aduan_nama || ''
            const kategoriName = selectedKategori.name || ''
            return kategoriNama.trim().toLowerCase() === kategoriName.trim().toLowerCase()
          })
        } else {
          data = []
        }
      }
      
      if (append) {
        aduanList.value = [...aduanList.value, ...data]
      } else {
        aduanList.value = data
      }
      
      if (response.meta) {
        meta.value = response.meta
        if (selectedCategory.value === 'semua') {
          hasMore.value = response.meta.current_page < Math.ceil(response.meta.total / response.meta.per_page)
          currentPage.value = response.meta.current_page
        } else {
          hasMore.value = false
        }
      }
    } else {
      toast.add({
        severity: 'warn',
        summary: 'Peringatan',
        detail: response?.message || 'Gagal memuat data aduan',
        life: 3000
      })
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat data aduan'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    })
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  if (hasMore.value && !loadingMore.value) {
    fetchAduan(currentPage.value + 1, true)
  }
}

const viewDetail = (id) => {
  router.push(`/services/complaint/masyarakat/${id}`)
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

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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

const handleShare = async (aduan) => {
  const shareData = {
    title: aduan.judul,
    text: aduan.judul,
    url: `${window.location.origin}/services/complaint/masyarakat/${aduan.id}`
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(shareData.url)
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
        await navigator.clipboard.writeText(shareData.url)
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

watch(selectedCategory, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    currentPage.value = 0
    aduanList.value = []
    fetchAduan(0, false)
  }
})

onMounted(async () => {
  await fetchKategori()
  fetchAduan()
})
</script>

