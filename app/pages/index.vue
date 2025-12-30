<template>
  <div class="bg-gray-100 h-full relative">
    <div class="relative h-96">
      <div class="flex z-30 p-4 justify-between absolute top-0 w-full items-center">
        <p class="font-bold text-white">logo</p>
        <NuxtLink to="/auth" class="text-white font-medium">
          <Button
          label="Profile"
          icon="pi pi-user"
          size="small"
          rounded
          class="bg-white! text-black! border-gray-300!"
        />
        </NuxtLink>
      </div>
      <NuxtImg
        src="/bg.jpg"
        alt="Sigap Logo"
        class="w-full object-cover h-full"
      />
      <div
        class="absolute inset-0 bg-linear-to-t from-gray-100 via-gray-100/20 to-transparent"
      ></div>
    </div>
    <PopularService />
  </div>
</template>