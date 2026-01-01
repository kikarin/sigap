<template>
  <div class="flex justify-between h-full flex-col">
    <div class="space-y-10 flex-1">
      <h1 class="font-semibold text-xl">Aduan Kamu</h1>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-2">
            <label for="Judul">Judul</label>
            <InputText
              id="Judul"
              v-model="value"
              aria-describedby="Judul-help"
              placeholder="Contoh : Jalan rusak dekat rumah"
              required
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="description">Deskripsi</label>
            <Textarea
              id="description"
              v-model="description"
              rows="5"
              autoResize
              placeholder="Jelaskan aduan kamu secara detail..."
              required
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <NuxtLink
        to="/services/complaint"
        class="inline-flex p-4 hover:cursor-pointer shrink-0 rounded-full border items-center justify-center border-gray-300 shadow-xl"
      >
        <i class="pi pi-arrow-left text-xl leading-none"></i>
      </NuxtLink>
      <NuxtLink to="/services/complaint/location" class="w-full">
        <Button
          label="Selanjutnya"
          class="w-full text-white font-semibold rounded-full shadow-lg transition-colors"
          rounded
          size="large"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: "complaint-layout",
});
</script>
