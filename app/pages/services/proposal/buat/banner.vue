<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto px-4 pb-32">
      <div class="flex items-center gap-3 mb-6">
        <h1 class="font-semibold text-xl text-gray-800">Thumbnail/Foto Banner</h1>
      </div>

      <div class="space-y-5">
        <div class="flex flex-col gap-2">
          <div class="mb-2">
            <label class="block font-medium text-gray-700 text-sm mb-1">
              Upload Thumbnail/Foto Banner <span class="text-red-500">*</span>
            </label>
            <Message size="small" severity="secondary" variant="simple">
              Format: JPG, PNG, GIF (Maks. 5MB)
            </Message>
          </div>

          <!-- Upload Area -->
          <div
            @click="triggerFileInput"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:bg-gray-50',
            ]"
          >
            <div v-if="!previewImage" class="flex flex-col justify-center gap-3 items-center">
              <i class="pi pi-image text-4xl text-gray-400"></i>
              <p class="text-sm text-gray-600">
                Klik atau seret gambar ke sini untuk upload
              </p>
              <p class="text-xs text-gray-500">
                Format: JPG, PNG, GIF (Maks. 5MB)
              </p>
            </div>
            <div v-else class="relative">
              <img
                :src="previewImage"
                alt="Preview"
                class="w-full h-64 object-cover rounded-lg"
              />
              <Button
                icon="pi pi-times"
                severity="danger"
                rounded
                @click.stop="removeImage"
                class="absolute top-2 right-2"
              />
            </div>

            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="hidden"
            />
          </div>

          <div v-if="selectedFile" class="text-xs text-gray-500">
            {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 border-t border-gray-200 shadow-lg z-50 max-w-md mx-auto">
      <Button
        label="Selanjutnya"
        @click="handleNext"
        :disabled="!selectedFile"
        class="w-full"
        rounded
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProposalForm } from '@/composables/useProposalForm'

const router = useRouter()
const { formData } = useProposalForm()

const fileInput = ref(null);
const selectedFile = ref(null);
const previewImage = ref(null);
const isDragging = ref(false);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      return;
    }

    selectedFile.value = file;
    formData.value.thumbnail_foto_banner = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  event.target.value = "";
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      return;
    }

    selectedFile.value = file;
    formData.value.thumbnail_foto_banner = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  selectedFile.value = null;
  previewImage.value = null;
  formData.value.thumbnail_foto_banner = null;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const goBack = () => {
  router.back()
}

const handleNext = () => {
  if (!selectedFile.value) {
    return
  }

  router.push('/services/proposal/buat/verifikasi')
}

definePageMeta({
  layout: "complaint-layout",
});
</script>
