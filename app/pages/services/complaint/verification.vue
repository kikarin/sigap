<template>
  <div class="flex justify-between h-full overflow-y-auto flex-col">
    <div class="space-y-10 flex-1 mb-5">
      <h1 class="font-semibold text-xl">Bukti laporan</h1>
      <FileUpload
        name="demo[]"
        url="/api/upload"
        @upload="onAdvancedUpload($event)"
        :multiple="true"
        accept="image/*"
        :maxFileSize="1000000"
      >
        <template #empty>
          <span>Drag and drop files to here to upload.</span>
        </template>
      </FileUpload>
    </div>
    <div class="flex items-center  gap-3">
      <NuxtLink
        to="/services/complaint/location"
        class="inline-flex p-4 hover:cursor-pointer shrink-0 rounded-full border items-center justify-center border-gray-300 "
      >
        <i class="pi pi-arrow-left text-xl leading-none"></i>
      </NuxtLink>
      <NuxtLink to="/services/complaint/type-complaint" class="w-full">
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
import { Config } from "primevue";
import { useToast } from "primevue/usetoast";
const toast = useToast();

const onUpload = () => {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
};
definePageMeta({
  layout: "complaint-layout",
});
</script>
