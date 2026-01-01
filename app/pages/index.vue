<template>
  <div class="bg-gray-100 min-h-screen relative">
    <div class="relative h-96">
      <div class="flex z-30 p-4 justify-between absolute top-0 w-full items-center">
        <NuxtImg src="/Lambang_Kabupaten_Bogor.png" alt="Sigap Logo" class="w-8 h-9" />
        <NuxtLink to="/profile" class="text-white font-medium">
          <Button
            label="Profile"
            icon="pi pi-user"
            size="small"
            rounded
            class="bg-white! text-black! border-gray-300!"
          />
        </NuxtLink>
      </div>
      <NuxtImg
        src="/bg.jpg"
        alt="Sigap Logo"
        class="w-full object-cover h-full"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-gray-100 via-gray-100/20 to-transparent"
      ></div>
    </div>
    <PopularService />
  </div>
</template>

<script setup lang="ts">
// Middleware auth.global.ts sudah otomatis diterapkan
</script>