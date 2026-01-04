<template>
  <div class="relative h-full flex flex-col">
    <div class="space-y-5 flex-1 overflow-y-auto pb-32">
      <div>
        <h1 class="font-semibold text-xl text-gray-800 mb-4">Formulir Surat</h1>
        
        <div class="flex items-center justify-between mb-6">
          <div
            v-for="(step, index) in totalSteps"
            :key="index"
            class="flex items-center flex-1"
          >
            <div class="flex items-center flex-1">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all"
                :class="
                  currentStep > index
                    ? 'bg-primary-500 text-white'
                    : currentStep === index
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                "
              >
                {{ index + 1 }}
              </div>
              <div
                v-if="index < totalSteps - 1"
                class="flex-1 h-1 mx-2 transition-all"
                :class="currentStep > index ? 'bg-primary-500' : 'bg-gray-200'"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loadingForm" class="flex items-center justify-center py-8">
        <ProgressSpinner />
      </div>

      <div v-else class="flex flex-col gap-4">
        <div
          v-for="field in currentStepFields"
          :key="field.id"
          class="flex flex-col gap-2"
        >
          <label :for="`field-${field.id}`" class="text-gray-700 text-sm">
            {{ field.nama_atribut }}
            <span v-if="field.is_required" class="text-red-500">*</span>
          </label>
          
          <InputText
            v-if="field.tipe_data === 'text'"
            :id="`field-${field.id}`"
            v-model="formData[field.id].nilai"
            :placeholder="`Masukkan ${field.nama_atribut.toLowerCase()}`"
            class="w-full"
          />
          
          <InputText
            v-else-if="field.tipe_data === 'number'"
            :id="`field-${field.id}`"
            v-model="formData[field.id].nilai"
            type="number"
            :placeholder="`Masukkan ${field.nama_atribut.toLowerCase()}`"
            class="w-full"
          />
          
          <InputText
            v-else-if="field.tipe_data === 'date'"
            :id="`field-${field.id}`"
            v-model="formData[field.id].nilai"
            type="date"
            class="w-full"
          />
          
          <Select
            v-else-if="field.tipe_data === 'select'"
            :id="`field-${field.id}`"
            v-model="formData[field.id].nilai"
            :options="field.opsi_pilihan || []"
            :placeholder="`Pilih ${field.nama_atribut.toLowerCase()}`"
            class="w-full"
          />
          
          <div v-else-if="field.tipe_data === 'boolean'" class="flex items-center gap-2">
            <Checkbox
              :id="`field-${field.id}`"
              v-model="formData[field.id].nilai"
              :binary="true"
            />
            <label :for="`field-${field.id}`" class="text-sm text-gray-600">
              {{ field.nama_atribut }}
            </label>
          </div>

          <div v-if="field.nama_lampiran" class="mt-2">
            <label class="text-gray-700 text-sm mb-2 block">
              {{ field.nama_lampiran }}
              <span v-if="field.is_required_lampiran" class="text-red-500">*</span>
              <span v-if="field.minimal_file > 0" class="text-gray-500 text-xs">
                (Minimal {{ field.minimal_file }} file)
              </span>
            </label>
            <FileUpload
              mode="basic"
              :multiple="field.minimal_file > 1"
              :accept="'image/*'"
              :maxFileSize="5000000"
              chooseLabel="Pilih File"
              class="w-full"
              @select="(event) => handleFileSelect(event, field.id)"
            />
            <div v-if="formData[field.id].lampiran_files && formData[field.id].lampiran_files.length > 0" class="mt-2 space-y-2">
              <div
                v-for="(file, index) in formData[field.id].lampiran_files"
                :key="index"
                class="flex items-center gap-2 p-2 bg-gray-50 rounded border"
              >
                <i class="pi pi-file text-gray-500"></i>
                <span class="text-sm text-gray-700 flex-1">{{ getFileName(file) }}</span>
                <Button
                  icon="pi pi-times"
                  severity="danger"
                  text
                  rounded
                  @click="removeFile(field.id, index)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <div class="max-w-md mx-auto px-4 py-4 w-full">
        <div class="flex items-center gap-3">
          <Button
            v-if="currentStep > 0"
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
            rounded
            @click="previousStep"
            class="shrink-0"
          />
          <Button
            v-if="currentStep < totalSteps - 1"
            label="Selanjutnya"
            class="flex-1 text-white font-semibold rounded-full shadow-lg transition-colors"
            rounded
            size="large"
            @click="nextStep"
          />
          <Button
            v-else
            label="Submit"
            class="flex-1 text-white font-semibold rounded-full shadow-lg transition-colors"
            rounded
            size="large"
            :loading="loading"
            :disabled="loading"
            @click="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { Button, InputText, Textarea, Select, Checkbox, FileUpload, ProgressSpinner } from "primevue";
import { useLetter } from "@/composables/useLetter";

const router = useRouter()
const route = useRoute()
const toast = useToast()
const { getDetailJenisSurat, createPengajuanSurat } = useLetter()

const currentStep = ref(0)
const fieldsPerStep = 4
const loading = ref(false)
const loadingForm = ref(false)
const jenisSuratId = ref(null)
const allFields = ref([])
const formData = ref({})
const tanggalSurat = ref(new Date().toISOString().split('T')[0])

const totalSteps = computed(() => {
  return Math.ceil(allFields.value.length / fieldsPerStep)
})

const currentStepFields = computed(() => {
  const start = currentStep.value * fieldsPerStep
  const end = start + fieldsPerStep
  return allFields.value.slice(start, end)
})

const getFileName = (file) => {
  if (file instanceof File) {
    return file.name
  }
  if (typeof file === 'string') {
    return file.split('/').pop()
  }
  return 'File'
}

const handleFileSelect = (event, atributId) => {
  const files = Array.from(event.files || [])
  if (!formData.value[atributId]) {
    formData.value[atributId] = { nilai: '', lampiran_files: [] }
  }
  formData.value[atributId].lampiran_files = [
    ...(formData.value[atributId].lampiran_files || []),
    ...files
  ]
}

const removeFile = (atributId, index) => {
  if (formData.value[atributId] && formData.value[atributId].lampiran_files) {
    formData.value[atributId].lampiran_files.splice(index, 1)
  }
}

const fetchDetailJenisSurat = async () => {
  if (!jenisSuratId.value) {
    toast.add({
      severity: 'warn',
      summary: 'Peringatan',
      detail: 'Jenis surat tidak ditemukan',
      life: 3000
    })
    router.push('/services/letter/category')
    return
  }

  loadingForm.value = true
  try {
    const response = await getDetailJenisSurat(jenisSuratId.value)
    if (response.success && response.data) {
      allFields.value = response.data.atribut.sort((a, b) => a.urutan - b.urutan)
      
      allFields.value.forEach(field => {
        formData.value[field.id] = {
          nilai: '',
          lampiran_files: []
        }
      })
    }
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Gagal memuat detail jenis surat'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 3000
    })
    router.push('/services/letter/category')
  } finally {
    loadingForm.value = false
  }
}

const nextStep = () => {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  const requiredFields = allFields.value.filter(f => f.is_required)
  const missingFields = requiredFields.filter(f => {
    const fieldData = formData.value[f.id]
    if (!fieldData || !fieldData.nilai || fieldData.nilai.trim() === '') {
      return true
    }
    return false
  })
  
  const requiredLampiran = allFields.value.filter(f => f.is_required_lampiran)
  const missingLampiran = requiredLampiran.filter(f => {
    const fieldData = formData.value[f.id]
    if (!fieldData || !fieldData.lampiran_files || fieldData.lampiran_files.length < f.minimal_file) {
      return true
    }
    return false
  })
  
  if (missingFields.length > 0 || missingLampiran.length > 0) {
    toast.add({
      severity: "warn",
      summary: "Peringatan",
      detail: "Mohon lengkapi semua field yang wajib diisi",
      life: 3000,
    });
    return
  }

  loading.value = true

  try {
    const atributData = {}
    Object.keys(formData.value).forEach(atributId => {
      const id = parseInt(atributId)
      const data = formData.value[id]
      if (data.nilai || (data.lampiran_files && data.lampiran_files.length > 0)) {
        atributData[id] = {
          nilai: data.nilai || undefined,
          lampiran_files: data.lampiran_files && data.lampiran_files.length > 0 ? data.lampiran_files : undefined
        }
      }
    })

    await createPengajuanSurat({
      jenis_surat_id: jenisSuratId.value,
      tanggal_surat: tanggalSurat.value,
      atribut: atributData
    })
    
    toast.add({
      severity: "success",
      summary: "Berhasil",
      detail: "Surat berhasil diajukan",
      life: 3000,
    });
    
    setTimeout(() => {
      router.push('/services/letter')
    }, 1500)
  } catch (error) {
    const err = error || {}
    const errorMessage = (err.response && err.response.message) || err.message || 'Terjadi kesalahan saat mengajukan surat'
    toast.add({
      severity: "error",
      summary: "Gagal",
      detail: errorMessage,
      life: 3000,
    });
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  jenisSuratId.value = route.query.jenis ? parseInt(route.query.jenis) : null
  if (jenisSuratId.value) {
    fetchDetailJenisSurat()
  } else {
    router.push('/services/letter/category')
  }
})

definePageMeta({
  layout: "complaint-layout",
});
</script>
