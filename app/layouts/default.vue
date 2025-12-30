<template>
  <div class="flex flex-col">
    <div class="w-full max-w-md  mx-auto ">
      <div class="h-screen flex flex-1 flex-col">
        <div class="flex-1">
          <slot />
        </div>
        <Navbar />
      </div>
    </div>
  </div>
</template>
