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
    <div class="mt-10 space-y-5 pb-5">
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

      <!-- Menu Lainnya -->
      <Card class="border border-gray-200">
        <template #content>
          <div class="space-y-1">
            <button
              v-for="menu in menuItems"
              :key="menu.id"
              @click="handleMenuClick(menu)"
              class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                   :class="menu.bgColor || 'bg-gray-100'">
                <i :class="[menu.icon, menu.iconColor || 'text-gray-600']"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-gray-800">{{ menu.label }}</p>
                <p v-if="menu.description" class="text-xs text-gray-500 mt-0.5">{{ menu.description }}</p>
              </div>
              <i class="pi pi-angle-right text-gray-400 flex-shrink-0"></i>
            </button>
          </div>
        </template>
      </Card>

      <!-- Logout -->
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

      <!-- Versi Aplikasi -->
      <div class="text-center py-4">
        <p class="text-xs text-gray-400">Versi 1.0.0</p>
      </div>
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
import { Card, Dialog, Button } from "primevue";

const { user: userData, logout } = useAuth()
const { get } = useApi()
const router = useRouter()
const toast = useToast()

const profileData = ref<any>(null)
const showLogoutDialog = ref(false)
const logoutLoading = ref(false)

const menuItems = [
  {
    id: 'berita',
    label: 'Berita & Pengumuman',
    description: 'Lihat berita dan pengumuman terbaru',
    icon: 'pi pi-newspaper',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    route: '/berita'
  },
  {
    id: 'riwayat',
    label: 'Riwayat',
    description: 'Riwayat layanan Anda',
    icon: 'pi pi-history',
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-600',
    route: '/history'
  },
  {
    id: 'kebijakan-privasi',
    label: 'Kebijakan Privasi',
    description: 'Ketentuan privasi data pengguna',
    icon: 'pi pi-shield',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 'syarat-ketentuan',
    label: 'Syarat & Ketentuan',
    description: 'Ketentuan penggunaan aplikasi',
    icon: 'pi pi-file',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    id: 'tentang',
    label: 'Tentang Aplikasi',
    description: 'Informasi tentang SIGAP',
    icon: 'pi pi-info-circle',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 'bantuan',
    label: 'Bantuan',
    description: 'Pusat bantuan dan FAQ',
    icon: 'pi pi-question-circle',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    id: 'kontak',
    label: 'Kontak',
    description: 'Hubungi kami',
    icon: 'pi pi-phone',
    bgColor: 'bg-teal-100',
    iconColor: 'text-teal-600'
  }
]

const handleMenuClick = (menu: any) => {
  // Jika menu punya route, redirect ke route tersebut
  if (menu.route) {
    router.push(menu.route)
    return
  }

  switch (menu.id) {
    case 'kebijakan-privasi':
      toast.add({
        severity: 'info',
        summary: 'Kebijakan Privasi',
        detail: 'Halaman kebijakan privasi akan segera tersedia',
        life: 3000
      })
      break
    case 'syarat-ketentuan':
      toast.add({
        severity: 'info',
        summary: 'Syarat & Ketentuan',
        detail: 'Halaman syarat & ketentuan akan segera tersedia',
        life: 3000
      })
      break
    case 'tentang':
      toast.add({
        severity: 'info',
        summary: 'Tentang Aplikasi',
        detail: 'SIGAP - Sistem Informasi Galuga Pintar\nAplikasi layanan publik untuk warga Kabupaten Bogor',
        life: 4000
      })
      break
    case 'bantuan':
      toast.add({
        severity: 'info',
        summary: 'Bantuan',
        detail: 'Halaman bantuan akan segera tersedia',
        life: 3000
      })
      break
    case 'kontak':
      toast.add({
        severity: 'info',
        summary: 'Kontak',
        detail: 'Email: info@sigap.go.id\nTelp: (0251) 1234567',
        life: 4000
      })
      break
  }
}

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
