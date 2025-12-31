<template>
    <div class="flex flex-col py-5 gap-4 overflow-y-scroll ">
      <div v-for="service in pathService" :key="service.id">
        <NuxtLink :to="service.path"
          class="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center"
            :class="service.bgColor"
          >
            <i :class="[service.icon, service.iconColor, 'text-xl']"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800 mb-1">
              {{ service.title }}
            </h3>
            <p class="text-xs text-gray-600 leading-relaxed">
              {{ service.description }}
            </p>
          </div>
          <i class="pi pi-chevron-right text-gray-400 text-sm"></i>
        </NuxtLink>
      </div>
    </div>
</template>

<script setup lang="ts">
import pathService from "@/docs/pathService.json";
</script>
