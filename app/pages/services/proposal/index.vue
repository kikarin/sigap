<template>
  <div class="h-full flex flex-col bg-primary-500">
    <div class="relative bg-primary-500 mt-5 pb-10 px-5">
      <button
        @click="goBack"
        class="mb-4 flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary-600 transition-colors"
      >
        <i class="pi pi-arrow-left text-white text-xl"></i>
      </button>

      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h1 class="text-white font-bold text-3xl mb-3">Proposal</h1>
          <p class="text-white/90 text-sm leading-relaxed">
            Sampaikan pengajuan proposal yang memuat rencana, tujuan, dan
            kebutuhan yang diajukan secara resmi.
          </p>
        </div>
        <div class="w-24 h-24 flex-shrink-0">
          <NuxtImg
            src="/business-report.png"
            alt="Illustration"
            class="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
    <div class="bg-white rounded-t-4xl flex-1 px-5 pt-16 pb-6">
      <div class="flex flex-col gap-4" v-for="value in path">
        <NuxtLink
          :to="value.link"
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
        >
          <div
            class="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0"
          >
            <i class="pi pi-megaphone text-blue-600 text-2xl"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-base text-gray-800 mb-1.5">
              {{value.title}}
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              {{value.description}}
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

<script setup>

const path = [
  {
    title: "Proposal",
    link: "/services/proposal/buat",
    description:
      "Ajukan proposal resmi yang memuat rencana, tujuan, dan kebutuhan Anda.",
  },
];
const router = useRouter();
const goBack = () => {
  router.back();
};
</script>
