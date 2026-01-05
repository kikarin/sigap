<template>
  <div class="flex flex-col gap-2">
    <NuxtLink
      v-for="service in filteredServices"
      :key="service.id"
      :to="service.path"
      class="bg-white rounded-xl p-2 shadow-sm border border-gray-300 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
    >
      <div
        class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
      >
        <NuxtImg
          :src="service.image"
          :alt="service.title"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-base text-gray-800 mb-1.5">
          {{ service.title }}
        </h3>
        <p class="text-sm text-gray-500 leading-relaxed">
          {{ service.description }}
        </p>
      </div>
      <i class="pi pi-angle-right text-primary-500 text-xl flex-shrink-0"></i>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import pathService from "@/docs/pathService.json";

interface Props {
  searchQuery?: string;
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: "",
});

const filteredServices = computed(() => {
  if (!props.searchQuery) {
    return pathService as any[];
  }

  const query = props.searchQuery.toLowerCase();
  return (pathService as any[]).filter(
    (service: any) =>
      service.title.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query)
  );
});
</script>
