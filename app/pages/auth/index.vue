<template>
  <div class="relative h-screen w-full flex flex-col">
    <!-- Background Image -->
    <div class="relative h-96 flex-shrink-0">
      <NuxtImg 
        src="/bg.jpg" 
        alt="Background" 
        class="w-full object-cover h-full" 
      />
      <div class="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent">
      </div>
    </div>
    
    <!-- Content Section -->
    <div class="flex-1 flex flex-col justify-center px-6 pb-8 bg-white">
      <div class="mb-8 flex justify-center">
        <div class="flex flex-col items-center">
          <NuxtImg
            src="/Lambang_Kabupaten_Bogor.png"
            alt="Logo"
            class="w-16 h-16 object-contain mb-4"
          />
          <h1 class="text-3xl uppercase font-bold text-gray-800 tracking-wider mb-2">
            SIGAP
          </h1>
          <p class="text-sm text-gray-700 max-w-xs text-center">
            Sistem Informasi Galuga Pintar
          </p>
        </div>
      </div>
      
      <div class="space-y-4 flex flex-col">
        <Button
          label="Masuk"
          class="w-full"
          rounded
          size="large"
          @click="router.push('/auth/login')"
        />
        <Button
          label="Daftar Akun Baru"
          class="w-full"
          rounded
          size="large"
          outlined
          @click="router.push('/auth/register')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth-layout",
});

const router = useRouter()
</script>