<template>
  <div class="min-h-full mx-auto my-auto">
    <div class="bg-white top-0 z-10 border-b border-gray-200 shadow-sm">
      <div class="px-5 py-4">
        <div class="flex items-center gap-3 mb-4">
          <h1 class="font-semibold text-xl text-gray-800">Layanan</h1>
        </div>
        <div class="relative">
          <InputText
            v-model="searchQuery"
            placeholder="Search..."
            class="w-full pl-4 pr-10 py-2.5"
          />
          <i class="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        </div>
      </div>
    </div>
    <div class="px-5 py-5">
      <Service :search-query="searchQuery" />
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const searchQuery = ref('')

const goBack = () => {
  router.back()
}
</script>