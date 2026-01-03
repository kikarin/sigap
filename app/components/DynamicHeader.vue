<template>
  <div>
    <header class="flex items-center gap-2">
      <button
        @click="goBack"
        class="p-1 h-12 w-12 rounded-full transition-colors hover:bg-gray-100"
      >
        <i class="pi pi-arrow-left text-black text-xl"></i>
      </button>
      <p class="text-lg font-semibold">{{ title }}</p>
    </header>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const goBack = () => {
  router.back();
};
defineProps({
  title: String,
});
</script>
