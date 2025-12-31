<template>
  <div class="px-6 py-4 space-y-10">
    <div class="flex items-center gap-4">
      <NuxtLink to="/auth">
        <i class="pi pi-arrow-left"></i>
      </NuxtLink>
      <p class="font-bold">Daftar Akun Baru</p>
    </div>
    <div class="space-y-6">
      <RegisterForm />
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: "auth-layout",
});
</script>
