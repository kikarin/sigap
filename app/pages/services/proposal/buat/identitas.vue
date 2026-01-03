<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex-1">
      <DynamicHeader title="Identitas Pemohon" />
      <div class="p-5 space-y-3">
        <div class="flex flex-col gap-1">
          <label for="username" class="">Nama Lengkap</label>
          <Message size="small" severity="secondary" variant="simple"
            >Pastikan sesuai Ktp</Message
          >
          <InputText
            id="username"
            v-model="value"
            placeholder="Contoh : Muzip"
            aria-describedby="username-help"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="Nik">NIK</label>
          <Message size="small" severity="secondary" variant="simple"
            >Pastikan sesuai Ktp</Message
          >
          <InputText
            id="Nik"
            v-model="value"
            placeholder="Masukan NIK"
            aria-describedby="username-help"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="No">Nomor whatapp atau telephone</label>
          <Message size="small" severity="secondary" variant="simple"
            >Gunakan no aktif untuk mempermudah konfirmasi</Message
          >
          <InputGroup class="md:w-80">
            <InputGroupAddon>
              <i class="pi pi-phone"></i>
            </InputGroupAddon>

            <InputMask
              id="phone"
              v-model="value2"
              mask="(+62) 899-9999-9999"
              placeholder="(+62) 899-9999-9999"
              fluid
            />
          </InputGroup>
        </div>
        <div class="flex flex-col gap-1">
          <label for="email">Email</label>
          <Message size="small" severity="secondary" variant="simple"
            >Gunakan Email aktif</Message
          >
          <InputText
            id="email"
            v-model="value"
            type="email"
            placeholder="Contoh : muzip@gmail.com"
            aria-describedby="username-help"
          />
        </div>
      </div>
    </div>
    <button class="bg-primary-500 text-white font-bold m-5 p-3 rounded-full">Simpan</button>
  </div>
</template>

<script setup>
const router = useRouter();
const goBack = () => {
  router.back();
};
</script>
