<template>
  <div class="min-h-screen bg-white pb-6">
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <ProgressSpinner />
    </div>

    <div v-else-if="berita" class="relative">
      <div class="relative h-[260px] w-full overflow-hidden">
        <NuxtImg
          v-if="berita.foto"
          :src="berita.foto"
          :alt="berita.title"
          class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          @click="openImageModal"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-white pointer-events-none"></div>

        <button
          class="absolute top-1 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white"
          @click="goBack"
        >
          <i class="pi pi-arrow-left text-sm"></i>
        </button>
      </div>

      <div class="-mt-1 px-4">
        <div class="bg-white rounded-3xl shadow-md p-5">
          <div class="flex items-center gap-2 mb-3">
            <span
              class="text-[11px] font-semibold uppercase tracking-wide py-1 rounded-full bg-blue-50 text-blue-600"
            >
              {{ berita.tipe_label || formatTipe(berita.tipe) }}
            </span>
          </div>

          <h1 class="font-bold text-[20px] text-gray-900 leading-snug mb-3">
            {{ berita.title }}
          </h1>

          <div class="flex items-center flex-wrap gap-2 text-xs text-gray-500 mb-5">
            <span>{{ formatDate(berita.tanggal || berita.created_at) }}</span>
            <span v-if="berita.views">• {{ berita.views }} Views</span>
          </div>

          <div class="border-t border-gray-100 pt-5">
            <div
              class="text-[15px] text-gray-800 leading-relaxed prose max-w-none
                    prose-ul:list-disc
                    prose-ol:list-decimal
                    prose-ul:pl-6
                    prose-ol:pl-6
                    prose-li:list-item
                    prose-ul:list-outside"
              v-html="berita.deskripsi"
            ></div>
          </div>

          <div v-if="berita.created_at || berita.updated_at" class="mt-6 pt-4 border-t border-gray-100">
            <p v-if="berita.created_at" class="text-[11px] text-gray-400">
              Dibuat: {{ formatDateTime(berita.created_at) }}
            </p>
            <p
              v-if="berita.updated_at && berita.updated_at !== berita.created_at"
              class="text-[11px] text-gray-400 mt-1"
            >
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

<style>
/* Heading */
.prose h1 {
  font-size: 2.25rem;
  font-weight: 700;
}

.prose h2 {
  font-size: 1.875rem;
  font-weight: 600;
}

.prose h3 {
  font-size: 1.7rem;
  font-weight: 600;
}

/* Paragraph */
.prose p {
  margin-bottom: 1em;
}

/* List (INI INTINYA) */
.prose ul {
  list-style-type: disc;
  padding-left: 1.8em;
  margin: 1em 0;
}

.prose ol {
  list-style-type: decimal;
  padding-left: 1.8em;
  margin: 1em 0;
}

.prose li {
  margin: 0.5em 0;
}

/* 🔥 CKEditor fix */
.prose li > p {
  display: inline;
  margin: 0;
}

/* Blockquote */
.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  margin: 1em 0;
  font-style: italic;
  color: #4b5563;
}

/* Media */
.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1em 0;
}

/* Link */
.prose a {
  color: #2563eb;
  text-decoration: underline;
}

/* Table */
.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.prose th,
.prose td {
  border: 1px solid #e5e7eb;
  padding: 0.5em;
}

.prose th {
  background-color: #f9fafb;
}
</style>

