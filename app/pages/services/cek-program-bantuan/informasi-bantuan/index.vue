<template>
  <div class="p-4 h-full flex space-y-5 flex-col">
    <div class="space-y-3 flex-1">
      <DynamicHeader title="Informasi Bantuan" />
      <div v-for="value in bantuanList" :key="value.title">
        <Card class="border border-gray-300">
          <template #header>
            <div class="px-3 py-2 flex items-center justify-between">
              <div>
                <p class="font-bold">
                  {{ value.name }}
                </p>
                <div class="flex gap-2 text-sm text-gray-400">
                  <p>{{ value.period }}</p>
                  <p>{{value.year}}</p>
                </div>
              </div>
              <p
                class="text-sm px-3 py-1 rounded-xl"
                :class="
                  value.status === 'PROSES'
                    ? 'text-yellow-500 bg-yellow-200'
                    : 'text-rose-500 bg-rose-200'
                "
              >
                {{ value.status }}
              </p>
            </div>
          </template>
          <template #content>
            <div class="flex w-full justify-between text-sm items-center">
              <div>
                <p class="font-bold ">{{ value.target }}</p>
                <p class="text-gray-400">{{ value.description }}</p>
              </div>
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
