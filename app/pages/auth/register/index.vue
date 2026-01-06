<template>
  <div class="px-6 py-6 min-h-full w-full overflow-y-auto">
    <div class="mb-6">
      <NuxtLink to="/auth" class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
        <i class="pi pi-arrow-left"></i>
        <span class="text-sm font-medium">Kembali</span>
      </NuxtLink>
    </div>
    <div class="flex justify-center items-start py-4">
      <div class="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: "auth-layout",
});
</script>
