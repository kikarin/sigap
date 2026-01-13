<template>
  <ClientOnly>
    <Dialog
      v-model:visible="dialogVisible"
      modal
      :closable="true"
      :draggable="false"
      :style="{ width: '90%', maxWidth: '400px' }"
      :pt="{
        root: { class: 'rounded-xl' },
        header: { class: 'pb-2' },
        content: { class: 'pt-0' }
      }"
    >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <i class="pi pi-download text-primary-600 text-2xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-800 m-0">Install Aplikasi</h3>
          <p class="text-sm text-gray-500 m-0">Pasang SIGAP di perangkat Anda</p>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <!-- Android Install -->
      <div v-if="!isIOS" class="space-y-3">
        <p class="text-gray-700 leading-relaxed">
          Pasang aplikasi SIGAP untuk akses yang lebih cepat dan pengalaman yang lebih baik.
        </p>
        <div class="bg-primary-50 border border-primary-200 rounded-lg p-3">
          <div class="flex items-start gap-2">
            <i class="pi pi-check-circle text-primary-600 mt-0.5"></i>
            <div class="text-sm text-gray-700">
              <p class="font-semibold mb-1">Keuntungan:</p>
              <ul class="list-disc list-inside space-y-1 text-gray-600">
                <li>Akses lebih cepat</li>
                <li>Bekerja offline</li>
                <li>Notifikasi langsung</li>
                <li>Pengalaman seperti aplikasi native</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- iOS Install Instructions -->
      <div v-else class="space-y-3">
        <p class="text-gray-700 leading-relaxed">
          Untuk menginstall aplikasi SIGAP di perangkat iOS Anda, ikuti langkah-langkah berikut:
        </p>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
              1
            </div>
            <p class="text-sm text-gray-700 flex-1">
              Tekan tombol <strong>Share</strong> 
              <i class="pi pi-share-alt text-blue-600 mx-1"></i> 
              di bagian bawah layar Safari
            </p>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
              2
            </div>
            <p class="text-sm text-gray-700 flex-1">
              Scroll ke bawah dan pilih <strong>"Add to Home Screen"</strong>
            </p>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
              3
            </div>
            <p class="text-sm text-gray-700 flex-1">
              Tekan <strong>"Add"</strong> untuk menyelesaikan instalasi
            </p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2 justify-end">
        <Button
          label="Nanti"
          text
          severity="secondary"
          @click="handleDismiss"
        />
        <Button
          v-if="!isIOS"
          label="Install Sekarang"
          icon="pi pi-download"
          @click="handleInstall"
        />
        <Button
          v-else
          label="Mengerti"
          icon="pi pi-check"
          @click="handleDismiss"
        />
      </div>
    </template>
  </Dialog>
  </ClientOnly>
</template>

<script setup lang="ts">
const { isIOS, showInstallPrompt, installPWA, dismissPrompt } = usePwaInstall()

// Create local reactive ref that syncs with showInstallPrompt
const dialogVisible = computed({
  get: () => {
    const value = showInstallPrompt.value
    console.log('Dialog visible getter called:', value)
    return value
  },
  set: (value: boolean) => {
    console.log('Dialog visible setter called:', value)
    if (!value) {
      dismissPrompt()
    }
  }
})

// Watch for changes to showInstallPrompt
watch(showInstallPrompt, (newVal, oldVal) => {
  console.log('showInstallPrompt changed from', oldVal, 'to', newVal)
  console.log('dialogVisible computed value:', dialogVisible.value)
}, { immediate: true, deep: true })

// Also watch dialogVisible to see if it updates
watch(dialogVisible, (newVal) => {
  console.log('dialogVisible changed to:', newVal)
}, { immediate: true })

const handleInstall = async () => {
  await installPWA()
}

const handleDismiss = () => {
  dismissPrompt()
}
</script>
