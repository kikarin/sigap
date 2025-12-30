<template>
  <div class="bg-white z-100 sticky bottom-0 flex px-4 border border-gray-200 py-3 justify-around items-end shadow-lg">
    <div
      v-for="value in nav"
      :key="value.name"
      class="flex flex-col items-center"
    >
      <NuxtLink
        v-if="value.type === 'danger'"
        :to="value.link"
        class="w-16 h-16 bg-rose-600 border border-white text-white rounded-full flex items-center justify-center shadow-lg -mt-16"
      >
        <p class="text-[10px] font-bold">{{ value.name }}</p>
      </NuxtLink>
      <NuxtLink
        v-else
        :to="value.link"
        class="flex flex-col items-center gap-1"
      >
        <i :class="['pi text-gray-500 text-xl', value.icon]"></i>
        <p class="text-sm text-gray-700">{{ value.name }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const nav = [
  { name: "Beranda", icon: "pi-home", link: "/" },
  { name: "Riwayat", icon: "pi-history", link: "/history" },
  { name: "DARURAT", type: "danger", link: "/emergency" },
  { name: "Layanan", icon: "pi-star", link: "/services" },
  { name: "Profile", icon: "pi-user", link: "/profile" },
];
</script>
