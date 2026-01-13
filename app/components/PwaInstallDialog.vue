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
      <!-- Desktop Install -->
      <div v-if="isDesktop" class="space-y-3">
        <p class="text-gray-700 leading-relaxed">
          Install aplikasi SIGAP di komputer Anda untuk pengalaman seperti aplikasi desktop native.
        </p>
        <div class="bg-primary-50 border border-primary-200 rounded-lg p-3">
          <div class="flex items-start gap-2">
            <i class="pi pi-check-circle text-primary-600 mt-0.5"></i>
            <div class="text-sm text-gray-700">
              <p class="font-semibold mb-1">Keuntungan:</p>
              <ul class="list-disc list-inside space-y-1 text-gray-600">
                <li>Aplikasi terpisah dari browser</li>
                <li>Bekerja offline</li>
                <li>Notifikasi desktop</li>
                <li>Icon di taskbar/dock</li>
                <li>Pengalaman seperti aplikasi desktop</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Manual Install Instructions for Desktop -->
        <div v-if="!hasDeferredPrompt" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
          <div class="flex items-start gap-2">
            <i class="pi pi-info-circle text-yellow-600 mt-0.5"></i>
            <div class="text-sm text-gray-700">
              <p class="font-semibold mb-1">Cara Install Manual:</p>
              <ol class="list-decimal list-inside space-y-1 text-gray-600">
                <li>Klik ikon <strong>+</strong> atau <strong>Install</strong> di address bar browser</li>
                <li>Atau klik menu <strong>⋮</strong> (tiga titik) → <strong>"Install SIGAP"</strong></li>
                <li>Klik <strong>"Install"</strong> pada dialog yang muncul</li>
                <li>Aplikasi akan terinstall dan muncul di desktop/taskbar</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- Android Install -->
      <div v-else-if="!isIOS" class="space-y-3">
        <p class="text-gray-700 leading-relaxed">
          Install aplikasi SIGAP di perangkat Android Anda sebagai aplikasi penuh, bukan hanya shortcut.
        </p>
        <div class="bg-primary-50 border border-primary-200 rounded-lg p-3">
          <div class="flex items-start gap-2">
            <i class="pi pi-check-circle text-primary-600 mt-0.5"></i>
            <div class="text-sm text-gray-700">
              <p class="font-semibold mb-1">Keuntungan:</p>
              <ul class="list-disc list-inside space-y-1 text-gray-600">
                <li>Aplikasi terpisah dari browser</li>
                <li>Akses lebih cepat</li>
                <li>Bekerja offline</li>
                <li>Notifikasi push</li>
                <li>Muncul di launcher seperti aplikasi biasa</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Manual Install Instructions for Android -->
        <div v-if="!hasDeferredPrompt" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
          <div class="flex items-start gap-2">
            <i class="pi pi-info-circle text-yellow-600 mt-0.5"></i>
            <div class="text-sm text-gray-700">
              <p class="font-semibold mb-1">Cara Install Manual:</p>
              <ol class="list-decimal list-inside space-y-1 text-gray-600">
                <li>Klik menu <strong>⋮</strong> (tiga titik) di pojok kanan atas browser</li>
                <li>Pilih <strong>"Install app"</strong> atau <strong>"Add to Home screen"</strong></li>
                <li>Klik <strong>"Install"</strong> pada dialog yang muncul</li>
                <li>Aplikasi akan terinstall dan muncul di launcher</li>
              </ol>
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
          v-if="!isIOS && hasDeferredPrompt"
          label="Install Aplikasi"
          icon="pi pi-download"
          :loading="isInstalling"
          @click="handleInstall"
        />
        <Button
          v-else-if="!isIOS && !hasDeferredPrompt"
          label="Mengerti"
          icon="pi pi-check"
          @click="handleDismiss"
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
const pwaInstall = usePwaInstall()
const { isIOS, showInstallPrompt, installPWA, dismissPrompt } = pwaInstall
const isDesktop = (pwaInstall as any).isDesktop as Ref<boolean>
const deferredPrompt = (pwaInstall as any).deferredPrompt as Ref<any>

const isInstalling = ref(false)
const hasDeferredPrompt = computed(() => !!deferredPrompt.value)

// Create local reactive ref that syncs with showInstallPrompt
const dialogVisible = computed({
  get: () => showInstallPrompt.value,
  set: (value: boolean) => {
    if (!value) {
      dismissPrompt()
    }
  }
})

const handleInstall = async () => {
  if (!deferredPrompt.value) {
    dismissPrompt()
    return
  }
  
  isInstalling.value = true
  try {
    await installPWA()
  } catch (error) {
    // Silent fail
  } finally {
    isInstalling.value = false
  }
}

const handleDismiss = () => {
  dismissPrompt()
}
</script>
