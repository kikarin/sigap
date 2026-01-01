<template>
  <div class="flex justify-between h-full flex-col">
    <div class="space-y-10 flex-1 ">
      <h1 class="font-semibold text-xl">Pilih Kategori Pengaduan</h1>
      <div class="flex flex-col gap-4">
        <div v-for="category in categories">
          <div
            :key="category.key"
            @click="selectedCategory = category.key"
            class="border p-2 flex justify-between items-center rounded-xl"
            :class="
              selectedCategory === category.key
                ? 'border-primary-500 border-2'
                : 'border-gray-300'
            "
          >
            <label :for="category.key">{{ category.name }}</label>
            <i
              class="pi"
              :class="
                selectedCategory === category.key
                  ? ' pi-check-circle text-blue-600'
                  : ' pi-circle text-gray-400'
              "
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <NuxtLink
        to="/services"
        class="inline-flex p-4 hover:cursor-pointer shrink-0 rounded-full border items-center justify-center border-gray-300 shadow-xl"
      >
        <i class="pi pi-arrow-left text-xl leading-none"></i>
      </NuxtLink>
      <NuxtLink to="/services/complaint/detail" class="w-full">
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
definePageMeta({
  layout: "complaint-layout",
});

const selectedCategory = ref("Production");
const categories = ref([
  { name: "Accounting", key: "A" },
  { name: "Marketing", key: "M" },
  { name: "Production", key: "P" },
  { name: "Research", key: "R" },
]);
</script>
