<template>
  <div class="flex flex-col">
    <div class="w-full max-w-md mx-auto">
      <div class="min-h-screen flex flex-col">
        <div class="flex-1 overflow-y-auto">
          <slot />
        </div>
        <Navbar />
      </div>
    </div>
  </div>
</template>

<script setup></script>