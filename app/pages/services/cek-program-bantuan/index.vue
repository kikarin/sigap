<template>
  <div class="h-full flex flex-col bg-primary-500">
    <HomeHeaderService
      title="Cek Program Bantuan"
      description="Informasi resmi mengenai program bantuan, periode, dan status pelaksanaannya."
      img-src="/hold-rupiah-coin.png"
    />
    <div class="bg-white rounded-t-4xl flex-1 px-5 pt-16 pb-6">
      <div class="flex flex-col gap-4">
        <!-- Card 1: Cek Program Bantuan -->
        <NuxtLink
          to="/services/cek-program-bantuan/informasi-bantuan"
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
        >
          <div
            class="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center shrink-0"
          >
            <i class="pi pi-search text-green-600 text-2xl"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-base text-gray-800 mb-1.5">
              Cek Program Bantuan
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Cari tahu informasi lengkap mengenai program bantuan yang tersedia.
            </p>
          </div>
          <i
            class="pi pi-angle-right text-primary-500 text-xl shrink-0"
          ></i>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
