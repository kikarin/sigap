<template>
  <div class="flex justify-between h-full flex-col">
    <div class="space-y-10 flex-1">
      <h1 class="font-semibold text-xl">Aduan Kamu</h1>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-2">
            <label for="Judul">Judul</label>
            <InputText
              id="Judul"
              v-model="value"
              aria-describedby="Judul-help"
              placeholder="Contoh : Jalan rusak dekat rumah"
              required
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="description">Deskripsi</label>
            <Textarea
              id="description"
              v-model="description"
              rows="5"
              autoResize
              placeholder="Jelaskan aduan kamu secara detail..."
              required
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex items-center gap-3">
      <Button
        icon="pi pi-arrow-left"
        severity="secondary"
        outlined
        rounded
        @click="goBack"
        class="shrink-0"
      />
      <NuxtLink to="/services/aduan/complaint/location" class="w-full">
        <Button
          label="Selanjutnya"
          class="w-full text-white font-semibold rounded-full shadow-lg transition-colors"
          rounded
          size="large"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const router = useRouter()
const { formData } = useAduanForm()

const value = ref(formData.value.judul || '')
const description = ref(formData.value.detail_aduan || '')

watch(value, (newVal) => {
  formData.value.judul = newVal
})

watch(description, (newVal) => {
  formData.value.detail_aduan = newVal
})

const goBack = () => {
  router.back()
}

definePageMeta({
  layout: "complaint-layout",
});
</script>
