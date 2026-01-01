<template>
  <div class="min-h-screen bg-primary-500 pb-20">
    <!-- Blue Header Section -->
    <div class="relative bg-primary-500 pt-12 pb-8 px-5">
      <button
        @click="goBack"
        class="mb-4 flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary-600 transition-colors"
      >
        <i class="pi pi-arrow-left text-white text-xl"></i>
      </button>
      
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h1 class="text-white font-bold text-3xl mb-3">Aduan</h1>
          <p class="text-white/90 text-sm leading-relaxed">
            Kirim laporan mengenai kejadian atau kendala yang Anda temui di sekitar Anda.
          </p>
        </div>
        <div class="w-24 h-24 flex-shrink-0">
          <NuxtImg
            src="/marketing.png"
            alt="Illustration"
            class="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>

    <!-- White Cards Section -->
    <div class="bg-white rounded-t-3xl -mt-6 px-5 pt-8 pb-6 min-h-[60vh]">
      <div class="flex flex-col gap-4">
        <!-- Card 1: Aduan Mayarakat -->
        <NuxtLink
          to="/services/complaint/masyarakat"
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
        >
          <div class="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <i class="pi pi-megaphone text-blue-600 text-2xl"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-base text-gray-800 mb-1.5">
              Aduan Mayarakat
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Sampaikan keluhan atau laporan Kamu agar dapat ditindaklanjuti dengan cepat.
            </p>
          </div>
          <i class="pi pi-angle-right text-primary-500 text-xl flex-shrink-0"></i>
        </NuxtLink>

        <!-- Card 2: Panggilan Darurat -->
        <NuxtLink
          to="/emergency"
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
        >
          <div class="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 relative">
            <i class="pi pi-phone text-blue-600 text-2xl"></i>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <i class="pi pi-bell text-white text-[8px]"></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-base text-gray-800 mb-1.5">
              Panggilan Darurat
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Hubungi layanan darurat kapan saja saat Kamu membutuhkan bantuan segera.
            </p>
          </div>
          <i class="pi pi-angle-right text-primary-500 text-xl flex-shrink-0"></i>
        </NuxtLink>

        <!-- Card 3: Lokasi Layanan Darurat -->
        <NuxtLink
          to="/services/complaint/location"
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
        >
          <div class="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 relative">
            <i class="pi pi-map-marker text-blue-600 text-2xl"></i>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <i class="pi pi-times text-white text-[8px]"></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-base text-gray-800 mb-1.5">
              Lokasi Layanan Darurat
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Temukan lokasi polisi, puskesmas, dan pemadam terdekat dari posisi Kamu.
            </p>
          </div>
          <i class="pi pi-angle-right text-primary-500 text-xl flex-shrink-0"></i>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

