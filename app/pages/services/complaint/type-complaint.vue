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
    </div>
    <div class="flex items-center mb-5 gap-3">
      <NuxtLink
        to="/services/complaint/detail"
        class="inline-flex p-4 hover:cursor-pointer shrink-0 rounded-full border items-center justify-center border-gray-300 shadow-xl"
      >
        <i class="pi pi-arrow-left text-xl leading-none"></i>
      </NuxtLink>
      <NuxtLink to="/services/complaint/verification" class="w-full">
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

const selectedCategory = ref("public");
const complaintVisibilityOptions = [
  {
    id: "public",
    label: "Public",
    description:
      "Your complaint will be visible to other users. Suitable for public issues such as damaged roads, broken street lights, etc.",
    icon: "users",
    isPublic: true,
  },
  {
    id: "private",
    label: "Private / Confidential",
    description:
      "Your complaint will only be visible to you and authorized officers. Suitable for sensitive or personal reports.",
    icon: "lock",
    isPublic: false,
  },
];
definePageMeta({
  layout: "complaint-layout",
});
</script>
