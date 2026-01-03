<template>
  <div class="flex justify-between h-full overflow-y-auto flex-col">
    <div class="space-y-10 flex-1 mb-5">
      <h1 class="font-semibold text-xl">Bukti laporan</h1>
      <FileUpload
        mode="basic"
        name="files[]"
        :multiple="true"
        accept="image/*"
        :maxFileSize="5000000"
        :auto="false"
        chooseLabel="Pilih File"
        @select="onFileSelect"
        @remove="onFileRemove"
        :fileLimit="10"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-8 text-center">
            <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-3"></i>
            <p class="text-gray-500 mb-2">Drag and drop files to here to upload</p>
            <p class="text-sm text-gray-400">atau klik untuk memilih file</p>
          </div>
        </template>
      </FileUpload>
      
      <div v-if="uploadedFiles.length > 0" class="space-y-2">
        <p class="text-sm font-medium text-gray-700">File yang dipilih:</p>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="(file, index) in uploadedFiles"
            :key="index"
            class="relative border rounded-lg p-2 bg-gray-50"
          >
            <div class="flex items-center gap-2">
              <i class="pi pi-image text-primary-500"></i>
              <span class="text-xs text-gray-700 truncate flex-1">{{ file.name }}</span>
              <button
                @click="removeFile(index)"
                class="text-red-500 hover:text-red-700"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button
        @click="goBack"
        class="inline-flex p-4 hover:cursor-pointer shrink-0 rounded-full border items-center justify-center border-gray-300"
      >
        <i class="pi pi-arrow-left text-xl leading-none"></i>
      </button>
      <NuxtLink to="/services/aduan/complaint/type-complaint" class="w-full">
        <Button
          label="Selanjutnya"
          class="w-full text-white font-semibold rounded-full shadow-lg transition-colors"
          rounded
          size="large"
        />
      </NuxtLink>
    </div>
  </div>
 
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

const router = useRouter()
const toast = useToast();
const { formData } = useAduanForm()

const uploadedFiles = ref([])

const goBack = () => {
  router.back()
}

const onFileSelect = (event) => {
  const files = Array.from(event.files)
  uploadedFiles.value = [...uploadedFiles.value, ...files]
  formData.value.files = uploadedFiles.value
}

const onFileRemove = (event) => {
  formData.value.files = uploadedFiles.value
}

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
  formData.value.files = uploadedFiles.value
}

definePageMeta({
  layout: "complaint-layout",
});
</script>
