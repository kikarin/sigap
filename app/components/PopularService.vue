<template>
  <div class="relative h-96 -mt-26 px-4 z-20">
    <div class="bg-white overflow-y-scroll rounded-t-2xl h-full flex flex-col gap-5  shadow-lg p-6 mx-auto max-w-md">
      <div>
        <h2 class="font-bold text-lg text-gray-800 mb-1">
          Layanan Populer
        </h2>
        <p class="text-sm text-gray-600">
          Jelajahi layanan publik yang sering digunakan oleh masyarakat
        </p>
      </div>
      <Service />
    </div>
  </div>
</template>

<script setup lang="ts">
import Service from './Service.vue';


</script>
