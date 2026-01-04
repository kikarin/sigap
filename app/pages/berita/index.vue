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
          <h1 class="font-semibold text-xl text-gray-800">Berita & Pengumuman</h1>
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
      <div v-if="beritaList.length > 0" class="px-5 py-4 space-y-4">
        <Card
          v-for="berita in beritaList"
          :key="berita.id"
          class="cursor-pointer hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
          @click="viewDetail(berita.id)"
        >
          <template #content>
            <div class="space-y-3">
              <div v-if="berita.foto" class="w-full h-48 -mx-4 -mt-4 mb-2">
                <NuxtImg
                  :src="berita.foto"
                  :alt="berita.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex items-center gap-2">
                <Tag
                  :value="berita.tipe_label || formatTipe(berita.tipe)"
                  :severity="getTipeSeverity(berita.tipe)"
                  class="text-xs"
                />
                <span class="text-xs text-gray-400">{{ formatDate(berita.tanggal) }}</span>
              </div>
              <h3 class="font-bold text-base text-gray-800 line-clamp-2">
                {{ berita.title }}
              </h3>
              <p class="text-sm text-gray-600 line-clamp-2">
                {{ berita.deskripsi }}
              </p>
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
              <i class="pi pi-newspaper text-gray-400 text-6xl"></i>
            </div>
          </div>
        </div>
        
        <p class="text-gray-700 font-medium text-lg mb-8">Tidak ada Berita & Pengumuman</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Card, Button, Tag, ProgressSpinner } from 'primevue'
import { useBerita } from '@/composables/useBerita'

const router = useRouter()
const toast = useToast()
const { getListBerita, getTipeBerita } = useBerita()

const beritaList = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const currentPage = ref(0)
const perPage = ref(10)
const hasMore = ref(false)
const meta = ref({})
const selectedFilter = ref('all')
const filterTabs = ref([
  { value: 'all', label: 'Semua' }
])

const goBack = () => {
  router.back()
}

const fetchTipeBerita = async () => {
  try {
    const response = await getTipeBerita()
    if (response.success && response.data) {
      filterTabs.value = [
        { value: 'all', label: 'Semua' },
        ...response.data.map(item => ({
          value: item.value,
          label: item.label
        }))
      ]
    }
  } catch (error) {
    console.error('Error fetching tipe berita:', error)
  }
}

const fetchBerita = async (page = 0, append = false) => {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const params = {
      page,
      per_page: perPage.value,
      tipe: selectedFilter.value !== 'all' ? selectedFilter.value : undefined
    }

    const response = await getListBerita(params)
    if (response.success && response.data) {
      if (append) {
        beritaList.value = [...beritaList.value, ...response.data]
      } else {
        beritaList.value = response.data
      }
      
      meta.value = response.meta || {}
      hasMore.value = meta.value.current_page < Math.ceil(meta.value.total / meta.value.per_page)
      currentPage.value = meta.value.current_page
    } else {
      beritaList.value = []
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat berita'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    })
    beritaList.value = []
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  if (hasMore.value && !loadingMore.value) {
    fetchBerita(currentPage.value + 1, true)
  }
}

const viewDetail = (id) => {
  router.push(`/berita/${id}`)
}

const formatTipe = (tipe) => {
  const tipeMap = {
    'berita': 'Berita',
    'event': 'Pengumuman'
  }
  return tipeMap[tipe] || tipe
}

const getTipeSeverity = (tipe) => {
  const severityMap = {
    'berita': 'info',
    'event': 'warning'
  }
  return severityMap[tipe] || null
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

watch(selectedFilter, () => {
  fetchBerita(0, false)
})

onMounted(() => {
  fetchTipeBerita()
  fetchBerita()
})
</script>

