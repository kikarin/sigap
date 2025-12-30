<template>
  <div class="relative h-96 mb-8">
    <NuxtLink
      to="/"
      class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg absolute left-4 top-4 z-10"
    >
      <i class="pi pi-times"></i>
    </NuxtLink>
    <NuxtImg 
      src="/bg.jpg" 
      alt="Sigap Logo" 
      class="w-full object-cover h-full" 
    />
    <div class="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent">
    </div>
  </div>
  
  <div class="mt-auto px-6 pb-8 text-center">
    <div class="mb-6 flex justify-center">
      <div class="flex flex-col items-center">
        <h1 class="text-3xl uppercase font-bold text-gray-800 tracking-wider mb-2">
          Sigap
        </h1>
        <p class="text-sm text-gray-700 max-w-xs">
          Layanan Informatif<br />
          Masyarakat Bontang Terpadu
        </p>
      </div>
    </div>
    <div class="space-y-4 flex flex-col mt-8">
      <NuxtLink
        to="/auth/login"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-full shadow-lg transition-colors"
      >
        Masuk
      </NuxtLink>
      <NuxtLink
        to="/auth/register"
        class="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-4 rounded-full shadow-lg transition-colors"
      >
        Daftar Akun Baru
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth-layout",
});
</script>