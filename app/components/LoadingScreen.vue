<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <div class="flex flex-col items-center space-y-4">
        <NuxtImg
          src="/Lambang_Kabupaten_Bogor.png"
          alt="Logo"
          class="w-24 h-24 object-contain animate-pulse"
        />
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-800 tracking-wider mb-1">
            SIGAP
          </h1>
          <p class="text-sm text-gray-600">
            Sistem Informasi Galuga Pintar
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const isLoading = useState('appLoading', () => true)

onMounted(() => {
  // 2 detik aja
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
