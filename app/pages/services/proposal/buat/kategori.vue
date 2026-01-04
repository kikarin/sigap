<template>
  <div class="flex justify-between h-full overflow-y-auto flex-col">
    <div class="space-y-6 flex-1 mb-5">
      <h1 class="font-semibold text-xl text-gray-800">Pilih Kategori Proposal</h1>
      <div v-if="loading" class="flex justify-center py-8">
        <ProgressSpinner />
      </div>
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          class="border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
          :class="
            selectedCategory === category.id
              ? 'border-primary-500 border-2'
              : 'border-gray-300 bg-white'
          "
        >
          <span
            class="font-medium text-base"
            :class="selectedCategory === category.id ? 'text-primary-500' : 'text-gray-800'"
          >
            {{ category.name }}
          </span>
          <i
            class="pi text-xl"
            :class="
              selectedCategory === category.id
                ? 'pi-check-circle text-primary-500'
                : 'pi-circle text-gray-400'
            "
          ></i>
        </div>
      </div>
    </div>
    <div class="flex items-center mb-5 gap-3">
      <Button
        icon="pi pi-arrow-left"
        severity="secondary"
        outlined
        rounded
        @click="goBack"
        class="shrink-0"
      />
      <Button
        label="Selanjutnya"
        @click="handleNext"
        :disabled="!selectedCategory"
        class="w-full"
        rounded
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { useProposal } from '@/composables/useProposal'

const router = useRouter()
const toast = useToast()

const selectedCategory = ref(null);
const categories = ref([])
const loading = ref(false)

const fetchKategori = async () => {
  loading.value = true
  try {
    const { getKategoriProposal } = useProposal()
    const response = await getKategoriProposal()
    if (response.success && response.data) {
      categories.value = response.data.map(item => ({
        id: item.value,
        name: item.label
      }))
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
  } finally {
    loading.value = false
  }
}

const handleNext = () => {
  if (selectedCategory.value) {
    router.push(`/services/proposal/buat/kegiatan?kategori=${selectedCategory.value}`)
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchKategori()
})

definePageMeta({
  layout: "complaint-layout",
});
</script>

