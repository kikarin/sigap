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
          <h1 class="font-semibold text-xl text-gray-800">Detail Berita</h1>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <ProgressSpinner />
    </div>

    <div v-else-if="berita" class="pb-4">
      <div v-if="berita.foto" class="w-full h-64 mb-4">
        <NuxtImg
          :src="berita.foto"
          :alt="berita.title"
          class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          @click="openImageModal"
        />
      </div>

      <div class="px-5 space-y-4">
        <div class="flex items-center gap-2">
          <Tag
            :value="berita.tipe_label || formatTipe(berita.tipe)"
            :severity="getTipeSeverity(berita.tipe)"
            class="text-sm"
          />
          <span class="text-sm text-gray-500">{{ formatDate(berita.tanggal) }}</span>
        </div>

        <h1 class="font-bold text-2xl text-gray-800">
          {{ berita.title }}
        </h1>

        <div class="prose max-w-none">
          <p class="text-base text-gray-700 leading-relaxed whitespace-pre-line">
            {{ berita.deskripsi }}
          </p>
        </div>

        <div v-if="berita.created_at || berita.updated_at" class="pt-4 border-t border-gray-200">
          <div class="text-xs text-gray-500 space-y-1">
            <p v-if="berita.created_at">
              Dibuat: {{ formatDateTime(berita.created_at) }}
            </p>
            <p v-if="berita.updated_at && berita.updated_at !== berita.created_at">
              Diperbarui: {{ formatDateTime(berita.updated_at) }}
            </p>
          </div>
        </div>
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
      <p class="text-gray-700 font-medium text-lg mb-8">Berita tidak ditemukan</p>
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
          <h3 class="font-semibold text-lg text-gray-800">{{ berita?.title }}</h3>
        </div>
      </template>
      <div v-if="berita?.foto" class="flex items-center justify-center bg-gray-100 p-4">
        <NuxtImg
          :src="berita.foto"
          :alt="berita.title"
          class="max-w-full max-h-[80vh] object-contain"
        />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Card, Button, Tag, ProgressSpinner, Dialog } from 'primevue'
import { useBerita } from '@/composables/useBerita'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { getDetailBerita } = useBerita()

const berita = ref(null)
const loading = ref(false)
const imageModalVisible = ref(false)

const goBack = () => {
  router.back()
}

const openImageModal = () => {
  if (berita.value?.foto) {
    imageModalVisible.value = true
  }
}

const closeImageModal = () => {
  imageModalVisible.value = false
}

const fetchDetail = async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id)
    const response = await getDetailBerita(id)
    if (response.success && response.data) {
      berita.value = response.data
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Gagal memuat detail berita',
        life: 3000
      })
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat detail berita'
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

onMounted(() => {
  fetchDetail()
})
</script>

