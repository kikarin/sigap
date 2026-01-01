<template>
  <div class="flex justify-between h-full overflow-y-auto flex-col">
    <div class="space-y-6 flex-1 mb-5">
      <h1 class="font-semibold text-xl text-gray-800">Pilih Kategori Aduan</h1>
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
      <button
        @click="goBack"
        class="inline-flex p-4 hover:cursor-pointer shrink-0 rounded-full border items-center justify-center border-gray-300 shadow-xl hover:bg-gray-50 transition-colors"
      >
        <i class="pi pi-arrow-left text-xl leading-none"></i>
      </button>
      <NuxtLink to="/services/complaint/detail" class="w-full">
        <Button
          label="Selanjutnya"
          class="w-full text-white font-semibold rounded-full shadow-lg transition-colors"
          rounded
          size="large"
          :disabled="!selectedCategory"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useToast } from "primevue/usetoast";

const router = useRouter()
const toast = useToast()
const { formData } = useAduanForm()
const { getKategoriAduan } = useAduan()

const selectedCategory = ref(formData.value.kategori_aduan_id || null);
const categories = ref([])
const loading = ref(false)

const fetchKategori = async () => {
  loading.value = true
  try {
    const response = await getKategoriAduan()
    if (response.success && response.data) {
      // Transform data dari API format {value, label} ke format yang digunakan di UI
      categories.value = response.data.map(item => ({
        id: item.value,
        name: item.label
      }))
      
      // Set selectedCategory jika sudah ada di formData
      if (formData.value.kategori_aduan_id) {
        selectedCategory.value = formData.value.kategori_aduan_id
      }
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat kategori aduan'
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

watch(selectedCategory, (newVal) => {
  if (newVal) {
    formData.value.kategori_aduan_id = newVal
  } else {
    formData.value.kategori_aduan_id = null
  }
}, { immediate: true })

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

