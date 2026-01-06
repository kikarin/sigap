<template>
  <div class="relative -mt-50 px-4 z-20 ">
    <div class="bg-white rounded-t-3xl shadow-lg p-5 mx-auto max-w-md">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 flex items-center justify-center">
          <i class="pi pi-thumbs-up text-primary-500 text-lg"></i>
        </div>
        <h2 class="font-bold text-lg text-gray-800">
          Layanan Populer
        </h2>
      </div>
      <Service />
    </div>
  </div>
</template>

<script setup lang="ts">
import Service from './Service.vue';


</script>
