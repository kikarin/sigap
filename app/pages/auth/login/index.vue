<template>
  <div class="px-6 py-4 space-y-10">
    <div>
      <NuxtLink to="/auth">
        <i class="pi pi-arrow-left"></i>
      </NuxtLink>
    </div>
    <div class="space-y-6">
      <h1 class="font-bold text-2xl">Masuk</h1>
      <div class="space-y-4 text-sm">
        <div class="flex flex-col gap-2">
          <label for="username" class="">Nomor HP / Email</label>
          <InputText
            id="username"
            placeholder="Masukan no hp atau email"
            aria-describedby="username-help"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="password">Password</label>
          <Password
            id="password"
            placeholder="Masukan password"
            class="w-full"
            inputClass="w-full pr-10 placeholder:text-gray-400 placeholder:text-sm"
            :feedback="false"
            toggleMask
          />
        </div>
        <Button
          label="Masuk"
          class="w-full text-white font-semibold rounded-full shadow-lg transition-colors"
          rounded
          size="large"
        />
      </div>
      <div>
        <p class="text-xs">
          saya menyetujui
          <span class="underline text-blue-500">kententuan layanan</span> & dan
          <span class="underline text-blue-500">kebijakan privasi</span> SIGAP
        </p>
      </div>
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: "auth-layout",
});
</script>
