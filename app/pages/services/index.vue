<template>
  <div class="px-5">
    <div class="space-y-5 py-5 sticky top-0 bg-white border-b border-gray-200 bottom-shadow-md ">
      <div class="flex gap-2 items-center">
        <i class="pi pi-arrow-left"></i>
        <h1 class="font-semibold text-xl">Layanan</h1>
      </div>
      <div class="relative">
        <i class="pi pi-search absolute right-3 top-3 text-gray-400"></i>
        <InputText placeholder="Search..." class="w-full pl-20" />
      </div>
    </div>
    <Service />
  </div>
</template>

<script setup lang="ts"></script>