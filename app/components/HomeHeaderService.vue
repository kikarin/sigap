<template>
  <div class="relative mt-5 pb-10 px-5">
    <button
      @click="goBack"
      class="mb-4 flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary-600 transition-colors"
    >
      <i class="pi pi-arrow-left text-white text-xl"></i>
    </button>

    <div class="flex items-start justify-between gap-4">
      <div class="flex-1">
        <h1 class="text-white font-bold text-3xl mb-3">{{title}}</h1>
        <p class="text-white/90 text-sm leading-relaxed">
          {{description}}
        </p>
      </div>
      <div class="w-24 h-24 flex-shrink-0">
        <NuxtImg
          :src="imgSrc"
          alt="Illustration"
          class="w-full h-full object-contain"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const goBack = () => {
  router.back();
};
defineProps({
  title: String,
  description: String,
  imgSrc: String,
});
</script>
