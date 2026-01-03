<template>
  <div class="h-full flex flex-col bg-primary-500">
    <HomeHeaderService
      title="Proposal"
      description="
            Sampaikan pengajuan proposal yang memuat rencana, tujuan, dan
            kebutuhan yang diajukan secara resmi."
      img-src="/business-report.png"
    />
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
              {{ value.title }}
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              {{ value.description }}
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
import HomeHeaderService from "~/components/HomeHeaderService.vue";

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
