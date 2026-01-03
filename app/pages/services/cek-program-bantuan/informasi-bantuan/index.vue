<template>
  <div class="p-4 h-full flex space-y-5 flex-col">
    <div class="space-y-3 flex-1">
      <DynamicHeader title="Informasi Bantuan" />
      <div v-for="value in bantuanList" :key="value.title">
        <Card class="border border-gray-300">
          <template #header>
            <div class="p-2 flex justify-between">
              <p>
                {{ value.name }}
              </p>
              <p class="text-sm" :class="value.status === 'PROSES' ? 'text-yellow-400' :  'text-red-400'">
                {{ value.status }}
              </p>
            </div>
          </template>
          <template #content>
            <div class="flex w-full justify-between text-sm items-center">
              <div>
                <p class="font-bold">{{ value.target }}</p>
                <p class="text-xs">{{ value.status }}</p>
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
  </div>
</template>

<script setup>
const bantuanList = [
  {
    id: 1,
    name: "BLT Dana Desa",
    year: 2024,
    period: "Triwulan 1",
    target: "KELUARGA",
    status: "PROSES",
    description:
      "Bantuan Langsung Tunai yang bersumber dari Dana Desa untuk keluarga kurang mampu.",
  },
  {
    id: 2,
    name: "BPNT",
    year: 2024,
    period: "Bulan Januari",
    target: "INDIVIDU",
    status: "SELESAI",
    description:
      "Bantuan Pangan Non Tunai berupa sembako untuk masyarakat yang terdaftar.",
  },
];
</script>
