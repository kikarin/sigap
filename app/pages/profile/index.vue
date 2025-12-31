<template>
  <div class="px-5">
    <div class="text-center p-4">
      <div class="w-full pt-10 items-center flex-col flex">
        <div class="rounded-full w-16 bg-blue-100 p-3">
          <i class="pi pi-user text-blue-500" style="font-size: 2.5rem"></i>
        </div>
        <div class="mt-5">
          <p class="text-base font-bold">{{ user.name }}</p>
          <p class="text-xs text-gray-500">{{ user.email }}</p>
        </div>
      </div>
    </div>
    <div class="mt-10 space-y-5 p-5">
      <Card class="border border-gray-200">
        <template #content>
          <div class="flex gap-2 flex-col">
            <button
              v-for="item in items"
              :key="item.label"
              class="flex-1 p-2 hover:cursor-pointer flex items-center justify-between text-center"
            >
              <div class="flex gap-2 items-center">
                <i
                  :class="item.icon"
                  style="font-size: 1.5rem"
                  class="text-blue-500"
                ></i>
                <p class="text-sm text-gray-500">
                  {{ item.label }}
                </p>
              </div>
              <i class="pi pi-angle-right text-blue-500"></i>
            </button>
          </div>
        </template>
      </Card>

      <Card class="border-gray-200 border">
        <template #content>
          <button
            class="w-full hover:cursor-pointer flex justify-between items-center text-center text-sm text-red-500"
          >
            <div class="flex gap-2 justify-center items-center">
              <i class="pi pi-sign-out"></i>
              <h1>Logout</h1>
            </div>
            <i class="pi pi-angle-right"></i>
          </button>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card } from "primevue";

const user = {
  name: "John Doe",
  email: "john.doe@example.com",
};

const items = [
  { label: "Account Settings", icon: "pi pi-cog" },
  { label: "Language", icon: "pi pi-globe" },
  { label: "Terms & Conditions", icon: "pi pi-file" },
  { label: "Privacy Policy", icon: "pi pi-shield" },
];
</script>
