<template>
  <div class="p-4">
    <DynamicHeader title="Kegiatan" />
    <div class="p-5 space-y-3">
      <div class="flex flex-col gap-1">
        <label for="kegiatan">Kegiatan</label>
        <Message size="small" severity="secondary" variant="simple"
          >Jelaskan kegiatan yang akan dilakukan</Message
        >
        <InputText
          id="kegiatan"
          v-model="value"
          placeholder="Contoh : Pelatihan Kepemimpinan"
          aria-describedby="username-help"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="deskripsi">Deskripsi Kegiatan</label>
        <Message size="small" severity="secondary" variant="simple"
          >Jelaskan secara detail kegiatan yang akan dilakukan</Message
        >
        <Textarea
          id="deskripsi"
          v-model="value"
          placeholder=""
          rows="5"
          cols=""
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="deskripsi">Usulan Anggaran</label>
        <InputNumber v-model="value1" inputId="integeronly" fluid />
      </div>
      <div class="flex flex-col gap-1">
        <label for="deskripsi">Kategori Proposal</label>
        <Select
          v-model="selectedCity"
          :options="cities"
          optionLabel="name"
          placeholder="Select a City"
          class="w-full md:w-56"
        />
      </div>
      <div class="flex flex-col gap-1">
        <div class="mb-2">
          <label class="block font-medium text-gray-700 text-base mb-1">
            File Pendukung <span class="text-red-500">*</span>
          </label>
        </div>

        <!-- Upload Area -->
        <div
          @click="triggerFileInput"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          :class="[
            'border-2 border-dashed rounded-xl   p-8 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300  hover:bg-gray-100',
          ]"
        >
          <div class="flex justify-center gap-3 items-center">
            <!-- Icon -->
            <i class="pi pi-file" style="font-size: 1.5rem"></i>

            <p class="text-sm text-gray-600 mb-1">Pilih file pdf, docx, xlsx</p>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.doc,.docx,.xlsx,.xls"
            multiple
            @change="handleFileSelect"
            class="hidden"
          />
        </div>

        <!-- File List -->
        <div v-if="files.length > 0" class="mt-4 space-y-2">
          <div
            v-for="(file, index) in files"
            :key="index"
            class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
          >
            <div class="flex items-center flex-1 min-w-0">
              <!-- File Icon -->
              <div
                class="flex-shrink-0 w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3"
              >
                <svg
                  class="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <!-- File Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ file.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatFileSize(file.size) }}
                </p>
              </div>
            </div>

            <!-- Remove Button -->
            <button
              @click="removeFile(index)"
              class="ml-3 flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <button
        class="w-full rounded-full text-white font-bold bg-primary-500 p-3 mt-5 hover:bg-primary-600 transition-colors"
      >
        Simpan
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const fileInput = ref(null);
const files = ref([]);
const isDragging = ref(false);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files || []);
  addFiles(selectedFiles);
  event.target.value = "";
};

const handleDrop = (event) => {
  isDragging.value = false;
  const droppedFiles = Array.from(event.dataTransfer.files || []);
  addFiles(droppedFiles);
};

const addFiles = (newFiles) => {
  const validFiles = newFiles.filter((file) => {
    const validTypes = [".pdf", ".doc", ".docx", ".xlsx", ".xls"];
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    return validTypes.includes(fileExtension);
  });

  files.value = [...files.value, ...validFiles];
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
</script>
