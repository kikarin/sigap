<template>
  <div class="p-4 h-full flex space-y-5 flex-col">
    <div class="space-y-3 flex-1 ">
      <DynamicHeader title="Buat Proposal" />
      <div>
        <h1 class="font-bold text-xl">
          Catat kegiatan tanggung jawab secara jelas dan akurat.
        </h1>
        <p class="text-sm text-gray-400">
          Lengkapi data proposal anda untuk memastikan laporan tercatat dengan
          transparansi
        </p>
      </div>

      <div class="flex flex-col gap-2"></div>
      <div v-for="value in proposalStep" :key="value.title">
        <Card class="border border-gray-300">
          <template #content>
            <div class="flex w-full justify-between text-sm items-center">
              <div>
                <p class="font-bold">{{ value.title }}</p>
                <p class="text-xs">belum di buat</p>
              </div>
              <p
                class="underline hover:cursor-pointer font-semibold text-black"
                @click="router.push(value.link)"
              >
                Ubah
              </p>
            </div>
          </template>
        </Card>
      </div>
    </div>
    <button class="rounded-full  bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 w-full mt-4 transition-colors">
        Selanjutnya
    </button>
  </div>
</template>

<script setup>
const router = useRouter();
const proposalStep = [
  {
    title: "Data Permohonan",
    link: "/services/proposal/buat/identitas",
  },
  {
    title: "Kegiatan",
    link: "/services/proposal/buat/kegiatan",
  },
  {
    title: "Lokasi Kegiatan",
    link: "/services/proposal/buat/lokasi",
  },
  {
    title: "Thumbnail/Foto Banner",
    link: "/services/proposal/buat/banner",
  },
];
const goBack = () => {
  router.back();
};
</script>
