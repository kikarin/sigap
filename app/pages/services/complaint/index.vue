<template>
  <div class="space-y-10">
    <h1 class="font-semibold">Pilih Kategori Pengaduan</h1>
    <div class="flex flex-col gap-4">
      <div v-for="category in categories">
        <div
          :key="category.key"
          @click="selectedCategory = category.key"
          class="border p-2 flex justify-between items-center rounded "
          :class="selectedCategory === category.key ? 'border-blue-500':'border-gray-300'"
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
