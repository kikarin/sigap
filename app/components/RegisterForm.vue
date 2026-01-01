<template>
  <div>
    <h1 class="font-bold text-2xl mb-4">Daftar</h1>
    <div class="space-y-4 text-sm">
      <div class="flex flex-col gap-2">
        <label for="nama">Nama</label>
        <InputText
          id="nama"
          v-model="formData.nama"
          placeholder="Masukan nama lengkap"
          aria-describedby="nama-help"
          class="placeholder:text-gray-400 placeholder:text-sm"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="nik">NIK</label>
        <InputText
          id="nik"
          v-model="formData.nik"
          placeholder="Masukan NIK"
          aria-describedby="nik-help"
          class="placeholder:text-gray-400 placeholder:text-sm"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="email">Email</label>
        <InputText
          id="email"
          v-model="formData.email"
          placeholder="Masukan email"
          aria-describedby="email-help"
          class="placeholder:text-gray-400 placeholder:text-sm"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="password">Password</label>
        <Password
          id="password"
          v-model="formData.password"
          placeholder="Masukan password"
          class="w-full"
          inputClass="w-full pr-10 placeholder:text-gray-400 placeholder:text-sm"
          :feedback="false"
          toggleMask
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="confirmPassword">Confirm Password</label>
        <Password
          id="confirmPassword"
          v-model="formData.confirmPassword"
          placeholder="Konfirmasi password"
          class="w-full"
          inputClass="w-full pr-10 placeholder:text-gray-400 placeholder:text-sm"
          :feedback="false"
          toggleMask
        />
      </div>
      <Button
        label="Daftar"
        class="w-full"
        rounded
        size="large"
        :loading="loading"
        @click="handleRegister"
      />
    </div>
    <div class="mt-4">
      <p class="text-xs">
        saya menyetujui
        <span class="underline text-blue-500">kententuan layanan</span> & dan
        <span class="underline text-blue-500">kebijakan privasi</span> SIGAP
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { post } = useApi()
const { login } = useAuth()
const router = useRouter()
const toast = useToast()

const formData = ref({
  nama: '',
  nik: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)

const handleRegister = async () => {
  // Validasi form
  if (!formData.value.nama || !formData.value.nik || !formData.value.email || !formData.value.password || !formData.value.confirmPassword) {
    toast.add({
      severity: 'warn',
      summary: 'Peringatan',
      detail: 'Mohon lengkapi semua field',
      life: 3000
    })
    return
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: 'Password dan konfirmasi password tidak sama',
      life: 3000
    })
    return
  }

  loading.value = true
  
  try {
    const response = await post('/register', {
      name: formData.value.nama,
      nik: formData.value.nik,
      email: formData.value.email,
      password: formData.value.password,
      password_confirmation: formData.value.confirmPassword
    })
    
    if (response.success && response.data) {
      // Register berhasil, langsung login
      login(response.data.user, response.data.token)
      
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: response.message || 'Registrasi berhasil',
        life: 3000
      })
      
      router.push('/')
    }
  } catch (error: any) {
    // Handle error
    const errorMessage = error.response?.message || error.message || 'Terjadi kesalahan saat registrasi'
    const errors = error.response?.errors
    
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: errors ? Object.values(errors).flat().join(', ') : errorMessage,
      life: 5000
    })
  } finally {
    loading.value = false
  }
}
</script>
