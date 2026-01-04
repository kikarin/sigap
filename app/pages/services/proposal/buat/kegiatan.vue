<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto px-4 pb-32">
      <div class="flex items-center gap-3 mb-6">
        <h1 class="font-semibold text-xl text-gray-800">Data Kegiatan</h1>
      </div>

      <div class="space-y-5">
        <div class="flex flex-col gap-2">
          <label for="nama-kegiatan" class="text-gray-700 text-sm font-medium">
            Nama Kegiatan <span class="text-red-500">*</span>
          </label>
          <InputText
            id="nama-kegiatan"
            v-model="formData.nama_kegiatan"
            placeholder="Contoh: Pelatihan Kepemimpinan"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="deskripsi" class="text-gray-700 text-sm font-medium">
            Deskripsi Kegiatan <span class="text-red-500">*</span>
          </label>
          <Message size="small" severity="secondary" variant="simple">
            Jelaskan secara detail kegiatan yang akan dilakukan
          </Message>
          <Textarea
            id="deskripsi"
            v-model="formData.deskripsi_kegiatan"
            placeholder="Masukkan deskripsi kegiatan"
            rows="5"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="usulan-anggaran" class="text-gray-700 text-sm font-medium">
            Usulan Anggaran <span class="text-red-500">*</span>
          </label>
          <InputNumber
            v-model="formData.usulan_anggaran"
            inputId="usulan-anggaran"
            mode="currency"
            currency="IDR"
            locale="id-ID"
            :min="0"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="nomor-telepon" class="text-gray-700 text-sm font-medium">
            Nomor Telepon <span class="text-red-500">*</span>
          </label>
          <Message size="small" severity="secondary" variant="simple">
            Gunakan nomor aktif untuk mempermudah konfirmasi
          </Message>
          <InputGroup class="w-full">
            <InputGroupAddon>
              <i class="pi pi-phone"></i>
            </InputGroupAddon>
            <InputMask
              id="nomor-telepon"
              v-model="formData.nomor_telepon_pengaju"
              mask="(+62) 899-9999-9999"
              placeholder="(+62) 899-9999-9999"
              class="w-full"
            />
          </InputGroup>
        </div>

        <div class="flex flex-col gap-2">
          <div class="mb-2">
            <label class="block font-medium text-gray-700 text-sm mb-1">
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
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:bg-gray-50',
            ]"
          >
            <div class="flex flex-col justify-center gap-3 items-center">
              <i class="pi pi-cloud-upload text-4xl text-gray-400"></i>
              <p class="text-sm text-gray-600">
                Klik atau seret file ke sini untuk upload
              </p>
              <p class="text-xs text-gray-500">
                Format: PDF, DOC, DOCX, XLSX, XLS
              </p>
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
                <div
                  class="flex-shrink-0 w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3"
                >
                  <i class="pi pi-file text-gray-600"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ file.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatFileSize(file.size) }}
                  </p>
                </div>
              </div>
              <Button
                icon="pi pi-times"
                severity="danger"
                text
                rounded
                @click="removeFile(index)"
                class="ml-3 flex-shrink-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 border-t border-gray-200 shadow-lg z-50 max-w-md mx-auto">
      <Button
        label="Selanjutnya"
        @click="handleNext"
        class="w-full"
        rounded
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProposalForm } from '@/composables/useProposalForm'

const router = useRouter()
const route = useRoute()
const { formData } = useProposalForm()

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
  formData.value.file_pendukung = [...formData.value.file_pendukung, ...validFiles];
};

const removeFile = (index) => {
  const removedFile = files.value[index]
  files.value.splice(index, 1);
  formData.value.file_pendukung = formData.value.file_pendukung.filter(f => f !== removedFile);
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
  if (!formData.value.nama_kegiatan || !formData.value.deskripsi_kegiatan || !formData.value.usulan_anggaran || !formData.value.nomor_telepon_pengaju) {
    return
  }

  router.push('/services/proposal/buat/lokasi')
}

onMounted(() => {
  if (route.query.kategori) {
    formData.value.kategori_proposal_id = parseInt(route.query.kategori)
  }
})

definePageMeta({
  layout: "complaint-layout",
});
</script>
