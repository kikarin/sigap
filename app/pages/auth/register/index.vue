<template>
  <div class="px-6 py-4 space-y-10">
    <div class="flex items-center gap-4">
      <NuxtLink to="/auth">
        <i class="pi pi-arrow-left"></i>
      </NuxtLink>
      <p>Daftar Akun Baru</p>
    </div>
    <div class="space-y-6">
      <div class="space-y-4 text-xs">
        <div class="flex flex-col gap-2">
          <label for="namaLengkap">Nama Lengkap</label>
          <InputText
            id="namaLengkap"
            placeholder="Contoh : Muzib Begawi"
            aria-describedby="namaLengkap-help"
            class="placeholder:text-gray-400 placeholder:text-sm"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="email">Email</label>
          <InputText
            id="email"
            placeholder="Contoh : MuzibBegawi@gmail.com"
            aria-describedby="email-help"
            class="placeholder:text-gray-400 placeholder:text-sm"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="phoneNumber" class="font-bold"
            >Nomor WhatsApp Atau Telepon</label
          >
          <label for="phoneNumber" class="text-gray-500"
            >Gunakan nomor aktif untuk mempermudah konfirmasi</label
          >
          <InputGroup>
            <InputGroupAddon>+62</InputGroupAddon>

            <InputMask
              mask="9999-9999-9999"
              placeholder="0812-3456-7890"
              class="w-full"
              number
            />
          </InputGroup>
        </div>

        <div class="flex flex-col gap-2">
          <label for="password">Password</label>
          <Password
            id="password"
            placeholder="Masukan password"
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
      <p class="text-xs">
        saya menyetujui
        <span class="underline text-blue-500">kententuan layanan</span> & dan
        <span class="underline text-blue-500">kebijakan privasi</span> SIGAP
      </p>
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: "auth-layout",
});
</script>
