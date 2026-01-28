<template>
  <div class="flex justify-between h-full overflow-y-auto flex-col">
    <div class="space-y-6 flex-1 mb-5">
      <h1 class="font-semibold text-xl text-gray-800">Kategori Proposal</h1>

      <div class="space-y-3">
        <p class="text-sm text-gray-600">
          Masukkan nama kategori proposal secara bebas, misalnya:
          <span class="font-medium">“Pemberdayaan Masyarakat”</span>,
          <span class="font-medium">“Infrastruktur Lingkungan”</span>, dll.
        </p>

        <div class="flex flex-col gap-2">
          <label for="kategori" class="text-gray-700 text-sm font-medium">
            Kategori Proposal <span class="text-red-500">*</span>
          </label>
          <InputText
            id="kategori"
            v-model="kategori"
            placeholder="Contoh: Pemberdayaan Masyarakat"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <div class="flex items-center mb-5 gap-3">
      <Button
        icon="pi pi-arrow-left"
        severity="secondary"
        outlined
        rounded
        @click="goBack"
        class="shrink-0"
      />
      <Button
        label="Selanjutnya"
        @click="handleNext"
        :disabled="!kategori.trim()"
        class="w-full"
        rounded
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProposalForm } from '@/composables/useProposalForm'

const router = useRouter()
const { formData } = useProposalForm()

const kategori = ref(formData.value.kategori_proposal || '')

const handleNext = () => {
  if (!kategori.value.trim()) return
  formData.value.kategori_proposal = kategori.value.trim()
  router.push('/services/proposal/buat/kegiatan')
}

const goBack = () => {
  router.back()
}

definePageMeta({
  layout: "complaint-layout",
});
</script>
