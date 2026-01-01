<template>
  <div class="flex justify-between h-full  flex-col">
    <div class="space-y-5 flex-1 overflow-y-auto pb-14">
      <h1 class="font-semibold text-xl">Lokasi Aduan</h1>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-5">
          <div class="flex flex-col w-52 gap-2">
            <label for="Judul">Titik Aduan</label>
            <ClientOnly>
              <MapLeaflet />
            </ClientOnly>
          </div>
          <div class="flex flex-col gap-2">
            <label for="kecamatan">Kecamatan</label>
            <Select
              id="kecamatan"
              v-model="selectedCity"
              :options="cities"
              optionLabel="name"
              placeholder="Select a City"
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="kecamatan">Kelurahan/Desa</label>
            <Select
              id="kecamatan"
              v-model="selectedCity"
              :options="cities"
              optionLabel="name"
              placeholder="Select a City"
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="kecamatan">Kelurahan/Desa</label>
            <Textarea
              id="kecamatan"
              v-model="selectedCity"
              :options="cities"
              rows="5"
              optionLabel="name"
              placeholder="Select a City"
              class="w-full"
            />
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/services/complaint/detail"
          class="inline-flex p-4 hover:cursor-pointer shrink-0 rounded-full border items-center justify-center border-gray-300 "
        >
          <i class="pi pi-arrow-left text-xl leading-none"></i>
        </NuxtLink>
        <NuxtLink to="/services/complaint/verification" class="w-full">
          <Button
            label="Selanjutnya"
            class="w-full text-white font-semibold rounded-full shadow-lg transition-colors"
            rounded
            size="large"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import { Textarea } from "primevue";
const cities = ["New York", "Rome", "London", "Istanbul", "Paris"];
definePageMeta({
  layout: "complaint-layout",
});
</script>
