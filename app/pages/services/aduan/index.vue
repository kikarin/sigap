<template>

  <div class="h-full flex flex-col bg-primary-500">
    <HomeHeaderService
      title="Aduan"
      description="Kirim laporan mengenai kejadian atau kendala yang Anda temui di sekitar Anda."
      img-src="/marketing.png"
    />
    <!-- White Cards Section -->
    <div class="bg-white rounded-t-4xl flex-1 px-5 pt-16 pb-6">
      <div class="flex flex-col gap-4">
        <NuxtLink
          to="/services/aduan/complaint/masyarakat"
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
        >
          <div
            class="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0"
          >
            <i class="pi pi-megaphone text-blue-600 text-2xl"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-base text-gray-800 mb-1.5">
              Aduan Mayarakat
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Sampaikan keluhan atau laporan Kamu agar dapat ditindaklanjuti
              dengan cepat.
            </p>
          </div>
          <i
            class="pi pi-angle-right text-primary-500 text-xl flex-shrink-0"
          ></i>
        </NuxtLink>

        <NuxtLink
          to="/services/emergency-location"

          class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
        >
          <div
            class="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 relative"
          >
            <i class="pi pi-phone text-blue-600 text-2xl"></i>
            <div
              class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            >
              <i class="pi pi-bell text-white text-[8px]"></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-base text-gray-800 mb-1.5">
              Panggilan Darurat
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Hubungi layanan darurat kapan saja saat Kamu membutuhkan bantuan
              segera.
            </p>
          </div>
          <i
            class="pi pi-angle-right text-primary-500 text-xl flex-shrink-0"
          ></i>
        </NuxtLink>

        <!-- Card 3: Lokasi Layanan Darurat -->
        <NuxtLink
          to="/services/complaint/location"

          class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
        >
          <div
            class="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 relative"
          >
            <i class="pi pi-map-marker text-blue-600 text-2xl"></i>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <i class="pi pi-bell text-white text-[8px]"></i>

            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-base text-gray-800 mb-1.5">
              Lokasi Layanan Darurat
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Temukan lokasi polisi, puskesmas, dan pemadam terdekat dari posisi
              Kamu.
            </p>
          </div>
          <i
            class="pi pi-angle-right text-primary-500 text-xl flex-shrink-0"
          ></i>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const goBack = () => {
  router.back();
};
</script>
