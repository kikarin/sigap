<template>
  <div class="px-5">
    <div class="text-center p-4">
      <div class="w-full pt-10 items-center flex-col flex">
        <div class="rounded-full w-16 bg-blue-100 p-3">
          <i class="pi pi-user text-blue-500" style="font-size: 2.5rem"></i>
        </div>
        <div class="mt-5">
          <p class="text-base font-bold">{{ profileData?.nama || userData?.name || 'User' }}</p>
          <p class="text-xs text-gray-500">{{ userData?.email || '' }}</p>
          <p v-if="profileData?.nik" class="text-xs text-gray-400 mt-1">NIK: {{ profileData.nik }}</p>
        </div>
      </div>
    </div>
    <div class="mt-10 space-y-5 p-5">
      <Card class="border border-gray-200" v-if="profileData">
        <template #content>
          <div class="space-y-3">
            <div v-if="profileData.tempat_lahir || profileData.tanggal_lahir" class="flex flex-col gap-2">
              <p class="text-xs text-gray-500">Tempat, Tanggal Lahir</p>
              <p class="text-sm">{{ profileData.tempat_lahir || '-' }}, {{ profileData.tanggal_lahir || '-' }}</p>
            </div>
            <div v-if="profileData.jenis_kelamin" class="flex flex-col gap-2">
              <p class="text-xs text-gray-500">Jenis Kelamin</p>
              <p class="text-sm">{{ profileData.jenis_kelamin }}</p>
            </div>
            <div v-if="profileData.kartu_keluarga" class="flex flex-col gap-2">
              <p class="text-xs text-gray-500">Kartu Keluarga</p>
              <p class="text-sm">{{ profileData.kartu_keluarga }}</p>
            </div>
          </div>
        </template>
      </Card>

      <Card class="border-gray-200 border">
        <template #content>
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            class="w-full"
            severity="danger"
            outlined
            @click="showLogoutDialog = true"
          />
        </template>
      </Card>
    </div>
  </div>

  <!-- Logout Confirmation Dialog -->
  <Dialog
    v-model:visible="showLogoutDialog"
    modal
    header="Konfirmasi Logout"
    :style="{ width: '90%', maxWidth: '400px' }"
  >
    <p>Apakah Anda yakin ingin logout?</p>
    <template #footer>
      <Button
        label="Batal"
        severity="secondary"
        outlined
        @click="showLogoutDialog = false"
      />
      <Button
        label="Logout"
        severity="danger"
        @click="handleLogout"
        :loading="logoutLoading"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Card, Dialog } from "primevue";

const { user: userData, logout } = useAuth()
const { get } = useApi()
const router = useRouter()
const toast = useToast()

const profileData = ref<any>(null)
const showLogoutDialog = ref(false)
const logoutLoading = ref(false)

// Fetch profile data
onMounted(async () => {
  try {
    const response = await get('/profile')
    if (response.success && response.data) {
      profileData.value = response.data
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error.response?.message || error.message || 'Gagal memuat data profile',
      life: 3000
    })
  }
})

const handleLogout = async () => {
  logoutLoading.value = true
  
  try {
    await logout()
    
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Logout berhasil',
      life: 3000
    })
    
    showLogoutDialog.value = false
    router.push('/auth')
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error.response?.message || error.message || 'Gagal logout',
      life: 3000
    })
  } finally {
    logoutLoading.value = false
  }
}
</script>
