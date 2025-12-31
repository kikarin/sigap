<template>
  <div class="px-6 py-4 space-y-10">
    <div>
      <NuxtLink to="/auth">
        <i class="pi pi-arrow-left"></i>
      </NuxtLink>
    </div>
    <div class="space-y-6">
      <LoginForm />
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: "auth-layout",
});
</script>
