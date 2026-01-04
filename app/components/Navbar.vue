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
        <i :class="['pi text-xl duration-300 ease-in-out', value.icon, isActive(value.link) ? 'text-blue-500' : 'text-gray-500']"></i>
        <p class="text-sm duration-300 ease-in-out " :class="isActive(value.link) ? 'text-blue-500' : 'text-gray-500'">{{ value.name }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const nav = [
  { name: "Beranda", icon: "pi-home", link: "/" },
  { name: "Berita", icon: "pi-list", link: "/berita" },
  { name: "DARURAT", type: "danger", link: "/emergency" },
  { name: "Layanan", icon: "pi-star", link: "/services" },
  { name: "Profile", icon: "pi-user", link: "/profile" },
];
const route = useRoute();
const isActive = (link: string) => {
  return route.path === link;
};
</script>
