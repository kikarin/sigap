<template>
  <div class="flex justify-between h-full overflow-y-auto flex-col">
    <div class="space-y-10 flex-1 mb-5">
      <h1 class="font-semibold text-xl">Pilih Jenis Aduan</h1>
      <div class="flex flex-col gap-4">
        <div v-for="complaint in complaintVisibilityOptions">
          <div
            :key="complaint.id"
            @click="selectedCategory = complaint.id"
            class="border p-2 flex flex-col gap-4 justify-between items-center rounded-xl"
            :class="
              selectedCategory === complaint.id
                ? 'border-primary-500 border-2'
                : 'border-gray-300'
            "
          >
            <div class="flex w-full items-center justify-between">
              <h1>{{ complaint.label }}</h1>
              <i
                class="pi"
                :class="
                  selectedCategory === complaint.id
                    ? ' pi-check-circle text-blue-600'
                    : ' pi-circle text-gray-400'
                "
              ></i>
            </div>
            <div>
              <p class="text-gray-500">{{ complaint.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col gap-2">
        <label for="alasan-melaporkan" class="text-gray-700 text-sm font-medium">
          Alasan Melaporkan
        </label>
        <Textarea
          id="alasan-melaporkan"
          v-model="alasanMelaporkan"
          rows="4"
          autoResize
          placeholder="Jelaskan alasan Anda melaporkan aduan ini..."
          class="w-full"
        />
      </div>
    </div>
    <div class="flex items-center mb-5 gap-3">
      <button
        @click="goBack"
        class="inline-flex p-4 hover:cursor-pointer shrink-0 rounded-full border items-center justify-center border-gray-300 shadow-xl"
      >
        <i class="pi pi-arrow-left text-xl leading-none"></i>
      </button>
      <Button
        label="Submit"
        class="w-full text-white font-semibold rounded-full shadow-lg transition-colors"
        rounded
        size="large"
        :loading="loading"
        :disabled="loading"
        @click="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useToast } from "primevue/usetoast";

const router = useRouter()
const toast = useToast()
const { formData, resetForm } = useAduanForm()
const { createAduan } = useAduan()

const selectedCategory = ref(formData.value.jenis_aduan || "publik");
const alasanMelaporkan = ref(formData.value.alasan_melaporkan || '')
const loading = ref(false)

const complaintVisibilityOptions = [
  {
    id: "publik",
    label: "Public",
    description:
      "Your complaint will be visible to other users. Suitable for public issues such as damaged roads, broken street lights, etc.",
    icon: "users",
    isPublic: true,
  },
  {
    id: "pengaduan",
    label: "Private / Confidential",
    description:
      "Your complaint will only be visible to you and authorized officers. Suitable for sensitive or personal reports.",
    icon: "lock",
    isPublic: false,
  },
];

watch(selectedCategory, (newVal) => {
  formData.value.jenis_aduan = newVal
})

watch(alasanMelaporkan, (newVal) => {
  formData.value.alasan_melaporkan = newVal
})

const goBack = () => {
  router.back()
}

const handleSubmit = async () => {
  // Validasi form
  if (!formData.value.kategori_aduan_id) {
    toast.add({
      severity: "warn",
      summary: "Peringatan",
      detail: "Mohon pilih kategori aduan",
      life: 3000,
    });
    return
  }

  if (!formData.value.judul || !formData.value.detail_aduan) {
    toast.add({
      severity: "warn",
      summary: "Peringatan",
      detail: "Mohon lengkapi judul dan deskripsi aduan",
      life: 3000,
    });
    return
  }

  if (!formData.value.latitude || !formData.value.longitude) {
    toast.add({
      severity: "warn",
      summary: "Peringatan",
      detail: "Mohon pilih titik lokasi",
      life: 3000,
    });
    return
  }

  if (!formData.value.deskripsi_lokasi) {
    toast.add({
      severity: "warn",
      summary: "Peringatan",
      detail: "Mohon isi deskripsi lokasi",
      life: 3000,
    });
    return
  }

  loading.value = true

  try {
    const response = await createAduan({
      kategori_aduan_id: formData.value.kategori_aduan_id,
      judul: formData.value.judul,
      detail_aduan: formData.value.detail_aduan,
      latitude: formData.value.latitude,
      longitude: formData.value.longitude,
      nama_lokasi: formData.value.nama_lokasi,
      deskripsi_lokasi: formData.value.deskripsi_lokasi,
      jenis_aduan: formData.value.jenis_aduan,
      alasan_melaporkan: formData.value.alasan_melaporkan || '',
      files: formData.value.files || []
    })

    if (response.success) {
      toast.add({
        severity: "success",
        summary: "Berhasil",
        detail: response.message || "Aduan berhasil dikirim",
        life: 3000,
      });
      
      // Reset form
      resetForm()
      
      // Redirect to complaint list after submit
      setTimeout(() => {
        router.push('/services/aduan/complaint/masyarakat')
      }, 1500)
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Terjadi kesalahan saat mengirim aduan'
    const errors = (err.response && err.response.errors) || null

    toast.add({
      severity: "error",
      summary: "Gagal",
      detail: errors ? Object.values(errors).flat().join(', ') : errorMessage,
      life: 5000,
    });
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: "complaint-layout",
});
</script>
