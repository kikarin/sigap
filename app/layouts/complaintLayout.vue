<template>
  <div class="flex flex-col">
    <div class="relative w-full max-w-md mx-auto overflow-hidden">
      <div class="relative flex flex-col">
        <div class="px-4 flex flex-col  py-5 h-dvh ">
          <div class="flex gap-3 items-center">
            <NuxtLink to="/services" class="">
              <i class="pi pi-arrow-left"></i>
            </NuxtLink>
            <p class="font-semibold text-sm">Buat</p>
          </div>
          <div class="mt-8 h-full flex-1">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
