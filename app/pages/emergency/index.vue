<template>
  <div class="space-y-10">
    <div class="flex flex-col items-center">
      <i class="pi pi-map-marker text-primary-500" style="font-size: 2rem"></i>
      <h1 class="font-bold">Lokasi Kamu Saat Ini</h1>
      <p class="w-xs text-center">{{ place }}</p>
    </div>
    <div class="flex flex-col gap-5">
      <div
        class="bg-white rounded-xl p-4 shadow-sm border border-gray-300 flex items-center gap-4 justify-between hover:shadow-md"
      >
        <div class="flex gap-2">
          <i class="pi pi-truck"></i>
          <p class="text-sm">Saya memerlukan ambulans</p>
        </div>
        <ToggleSwitch />
      </div>

      <div
        class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-md w-full"
      >
        <div class="flex flex-col items-center gap-8">
          <h1 class="text-xl font-semibold text-gray-800 text-center">
            Tekan tombol darurat selama 3 detik
          </h1>

          <div class="relative">
            <!-- Progress ring -->
            <svg
              class="absolute inset-0 w-40 h-40 -rotate-90"
              style="left: -16px; top: -16px"
            >
              <circle
                cx="80"
                cy="80"
                r="76"
                stroke="#fee2e2"
                stroke-width="8"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="76"
                stroke="#ef4444"
                stroke-width="8"
                fill="none"
                :stroke-dasharray="2 * Math.PI * 76"
                :stroke-dashoffset="2 * Math.PI * 76 * (1 - progress / 100)"
                style="transition: stroke-dashoffset 0.03s linear"
              />
            </svg>

            <!-- Button -->
            <button
              @mousedown="handlePressStart"
              @mouseup="handlePressEnd"
              @mouseleave="handlePressEnd"
              @touchstart="handlePressStart"
              @touchend="handlePressEnd"
              :class="[
                'relative w-32 h-32 bg-gradient-to-b from-red-500 to-red-600 rounded-full text-white font-bold text-lg transition-all duration-150 select-none',
                isPressed ? 'scale-95 shadow-md' : 'scale-100 shadow-xl',
                isTriggered ? 'animate-pulse' : '',
              ]"
              :style="{
                boxShadow: isPressed
                  ? '0 4px 12px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.2)'
                  : '0 8px 24px rgba(239, 68, 68, 0.5), 0 4px 8px rgba(0, 0, 0, 0.1)',
              }"
            >
              DARURAT
            </button>
          </div>

          <!-- Status message -->
          <p
            v-if="isPressed && !isTriggered"
            class="text-sm text-gray-600 animate-pulse"
          >
            Tahan terus... {{ Math.ceil((3000 - progress * 30) / 1000) }}s
          </p>

          <div
            v-if="isTriggered"
            class="flex items-center gap-2 text-red-600 font-semibold animate-pulse"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Darurat Diaktifkan!</span>
          </div>

          <p
            v-if="!isPressed && !isTriggered"
            class="text-sm text-gray-500 text-center"
          >
            Tahan tombol untuk mengaktifkan
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const place = ref<string>("");
definePageMeta({
  layout: "emergency-layout",
});

const getCurrentPosistion = async () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      reverseGeocode(position.coords.latitude, position.coords.longitude);
    },
    (error) => {
      console.error("Error Code = " + error.code + " - " + error.message);
    }
  );
};

const reverseGeocode = async (latitude: number, longitude: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
  );
  const data = await response.json();
  place.value = data.display_name;
};
onMounted(() => {
  getCurrentPosistion();
});

import { ref, onBeforeUnmount } from "vue";

const isPressed = ref(false);
const progress = ref(0);
const isTriggered = ref(false);
let pressTimer = null;
let progressInterval = null;

const handlePressStart = () => {
  isPressed.value = true;
  progress.value = 0;

  // Update progress every 30ms
  progressInterval = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(progressInterval);
      return;
    }
    progress.value += 100 / (3000 / 30); // 3000ms total / 30ms interval
  }, 30);

  // Trigger emergency after 3 seconds
  pressTimer = setTimeout(() => {
    isTriggered.value = true;
    clearInterval(progressInterval);
    progress.value = 100;

    // Reset after showing message
    setTimeout(() => {
      isTriggered.value = false;
      progress.value = 0;
    }, 3000);
  }, 3000);
};

const handlePressEnd = () => {
  isPressed.value = false;
  clearTimeout(pressTimer);
  clearInterval(progressInterval);

  // Reset progress if not completed
  if (progress.value < 100) {
    progress.value = 0;
  }
};

onBeforeUnmount(() => {
  clearTimeout(pressTimer);
  clearInterval(progressInterval);
});
</script>
