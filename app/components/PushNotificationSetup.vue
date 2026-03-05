<template>
  <Card v-if="isSupported" class="mb-4 border border-gray-200">
    <template #content>
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="font-semibold text-lg text-gray-800 mb-1">
            Notifikasi Push
          </h3>
          <p class="text-sm text-gray-600">
            Dapatkan notifikasi real-time saat status aduan, proposal, atau surat Anda berubah
          </p>
        </div>
        <div class="ml-4">
          <Button
            v-if="permission === 'default'"
            label="Aktifkan"
            @click="handleEnable"
            :loading="loading"
            severity="primary"
          />
          <div v-else-if="permission === 'granted' && isSubscribed" class="flex items-center gap-2">
            <Tag value="Aktif" severity="success" />
            <Button
              label="Nonaktifkan"
              @click="handleDisable"
              :loading="loading"
              severity="secondary"
              text
              size="small"
            />
          </div>
          <Tag
            v-else-if="permission === 'granted' && !isSubscribed"
            value="Belum Subscribe"
            severity="warning"
          />
          <Tag
            v-else
            value="Diblokir"
            severity="danger"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const pushNotification = usePushNotification()

const isSupported = computed(() => pushNotification.isSupported())
const permission = ref<NotificationPermission>(pushNotification.checkPermission())
const isSubscribed = ref(false)
const loading = ref(false)

onMounted(async () => {
  if (isSupported.value) {
    isSubscribed.value = await pushNotification.isSubscribed()
  }
})

const handleEnable = async () => {
  try {
    loading.value = true
    await pushNotification.enableNotifications()
    permission.value = pushNotification.checkPermission()
    isSubscribed.value = true
    
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Notifikasi push telah diaktifkan',
      life: 3000
    })
  } catch (error: any) {
    console.error('Error enabling notifications:', error)
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error.message || 'Gagal mengaktifkan notifikasi',
      life: 3000
    })
    permission.value = pushNotification.checkPermission()
  } finally {
    loading.value = false
  }
}

const handleDisable = async () => {
  try {
    loading.value = true
    await pushNotification.unsubscribeFromPush()
    isSubscribed.value = false
    
    toast.add({
      severity: 'info',
      summary: 'Berhasil',
      detail: 'Notifikasi push telah dinonaktifkan',
      life: 3000
    })
  } catch (error: any) {
    console.error('Error disabling notifications:', error)
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error.message || 'Gagal menonaktifkan notifikasi',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>
