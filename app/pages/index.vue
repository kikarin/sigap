<template>
  <div class="bg-gray-100 min-h-screen relative">
    <div class="relative h-96">
      <div class="flex z-30 p-4 justify-between absolute top-0 w-full items-center">
        <div class="flex items-center gap-2">
          <NuxtImg src="/Lambang_Kabupaten_Bogor.png" alt="Sigap Logo" class="w-8 h-9" />
          <h1 class="text-white font-bold text-lg">SIGAP</h1>
        </div>
        <Button
          :label="isAuthenticated ? 'Profile' : 'Masuk'"
          :icon="isAuthenticated ? 'pi pi-user' : 'pi pi-sign-in'"
          size="small"
          rounded
          class="bg-white! text-black! border-gray-300!"
          @click="handleProfileClick"
        />
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
const { isAuthenticated } = useAuth()
const router = useRouter()

const handleProfileClick = () => {
  if (isAuthenticated.value) {
    router.push('/profile')
  } else {
    router.push('/auth')
  }
}
</script>