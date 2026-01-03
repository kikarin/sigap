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
          <h1 class="font-semibold text-xl text-gray-800">Pengajuan Proposal</h1>
        </div>
      </div>
      
      <div class="px-5 pb-3">
        <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            v-for="category in filterCategories"
            :key="category.id"
            @click="handleCategoryChange(category.id)"
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
      <div v-if="proposalList.length > 0" class="px-5 py-4 space-y-4">
        <Card
          v-for="proposal in proposalList"
          :key="proposal.id"
          class="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
          @click="viewDetail(proposal.id)"
        >
          <template #content>
            <div class="space-y-3">
              <div v-if="proposal.thumbnail_foto_banner" class="mb-3">
                <NuxtImg
                  :src="proposal.thumbnail_foto_banner"
                  :alt="proposal.nama_kegiatan"
                  class="w-full h-40 object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 class="font-bold text-base text-gray-800 mb-2 line-clamp-2">
                  {{ proposal.nama_kegiatan }}
                </h3>
                <div class="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
                  <span>{{ formatTimeAgo(proposal.created_at) }}</span>
                  <span v-if="proposal.status">•</span>
                  <Tag
                    v-if="proposal.status"
                    :value="proposal.status_label || formatStatus(proposal.status)"
                    :severity="getStatusSeverity(proposal.status)"
                    class="text-xs"
                  />
                  <span v-if="proposal.kategori_proposal_nama">•</span>
                  <span v-if="proposal.kategori_proposal_nama" class="text-xs text-gray-500">
                    {{ proposal.kategori_proposal_nama }}
                  </span>
                </div>
              </div>
              
              <div v-if="proposal.usulan_anggaran" class="text-sm font-semibold text-primary-500">
                {{ proposal.usulan_anggaran_formatted || formatCurrency(proposal.usulan_anggaran) }}
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
        
        <p class="text-gray-700 font-medium text-lg mb-8">Tidak ada Proposal</p>
      </div>
    </template>

    <div class="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-20">
      <Button
        label="Buat Proposal"
        icon="pi pi-plus"
        class="shadow-lg"
        rounded
        size="large"
        @click="router.push('/services/proposal/buat/kategori')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Card, Button, Tag, ProgressSpinner } from 'primevue'
import { useProposal } from '@/composables/useProposal'

const router = useRouter()
const toast = useToast()
const { getKategoriProposal, getListPengajuanProposal } = useProposal()

const proposalList = ref([])
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

const handleCategoryChange = (categoryId) => {
  selectedCategory.value = categoryId
  currentPage.value = 0
  proposalList.value = []
  hasMore.value = false
  fetchProposal(0, false)
}

const fetchKategori = async () => {
  try {
    const response = await getKategoriProposal()
    if (response.success && response.data) {
      kategoriList.value = response.data
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat kategori proposal'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 3000
    })
  }
}

const fetchProposal = async (page = 0, append = false) => {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const params = {
      page: page || 0,
      per_page: selectedCategory.value === null ? 10 : -1
    }

    const response = await getListPengajuanProposal(params)

    if (response && response.success) {
      let data = Array.isArray(response.data) ? response.data : []
      
      if (selectedCategory.value !== null && selectedCategory.value !== undefined) {
        const selectedKategori = kategoriList.value.find(k => k.value === selectedCategory.value)
        if (selectedKategori) {
          data = data.filter(item => {
            const kategoriNama = (item.kategori_proposal_nama || '').trim().toLowerCase()
            const kategoriLabel = (selectedKategori.label || '').trim().toLowerCase()
            return kategoriNama === kategoriLabel
          })
        } else {
          data = []
        }
      }
      
      if (append) {
        proposalList.value = [...proposalList.value, ...data]
      } else {
        proposalList.value = data
      }
      
      if (response.meta) {
        meta.value = response.meta
        if (selectedCategory.value === null) {
          hasMore.value = response.meta.current_page < Math.ceil(response.meta.total / response.meta.per_page)
          currentPage.value = response.meta.current_page
        } else {
          hasMore.value = false
        }
      }
    } else {
      proposalList.value = []
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat data proposal'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    })
    proposalList.value = []
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  if (hasMore.value && !loadingMore.value) {
    const nextPage = currentPage.value + 1
    fetchProposal(nextPage, true)
    currentPage.value = nextPage
  }
}

const viewDetail = (id) => {
  // TODO: Implement detail page jika diperlukan
  router.push(`/services/proposal/${id}`)
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
  fetchProposal()
})
</script>
