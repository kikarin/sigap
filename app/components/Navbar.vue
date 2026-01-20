<template>
  <div class="bg-white sticky bottom-0 flex px-4 py-3 justify-around items-end shadow-lg">
    <div
      v-for="value in nav"
      :key="value.name"
      class="flex flex-col items-center"
    >
      <NuxtLink
        v-if="value.type === 'danger'"
        :to="value.link"
        class="w-16 h-16 bg-rose-600 border-4 border-white text-white rounded-full flex items-center justify-center shadow-lg -mt-16 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <p class="text-[10px] font-bold">{{ value.name }}</p>
      </NuxtLink>
      <NuxtLink
        v-else 
        :to="value.link"
        class="flex flex-col items-center gap-1 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <div class="relative">
          <i :class="['pi text-xl transition-all duration-300', value.icon, isActive(value.link) ? 'text-blue-500 scale-110' : 'text-gray-500']"></i>
          <div 
            v-if="isActive(value.link)"
            class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full animate-pulse"
          ></div>
        </div>
        <p class="text-xs transition-all duration-300 font-medium" :class="isActive(value.link) ? 'text-blue-500' : 'text-gray-500'">{{ value.name }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const nav = [
  { name: "Beranda", icon: "pi-home", link: "/" },
  { name: "Berita", icon: "pi-list", link: "/berita" },
  { name: "DARURAT", type: "danger", link: "/services/emergency-location" },
  { name: "Layanan", icon: "pi-star", link: "/services" },
  { name: "Profile", icon: "pi-user", link: "/profile" },
];
const route = useRoute();
const isActive = (link: string) => {
  return route.path === link;
};
</script>
