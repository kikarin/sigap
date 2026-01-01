<template>
  <div>
    <h1 class="font-bold text-2xl">Masuk</h1>
    <div class="space-y-4 text-sm">
      <div class="flex flex-col gap-2">
        <label for="username" class="">Nomor HP / Email</label>
        <InputText
          id="username"
          v-model="username"
          placeholder="Masukan no hp atau email"
          aria-describedby="username-help"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="password">Password</label>
        <Password
          id="password"
          v-model="password"
          placeholder="Masukan password"
          class="w-full"
          inputClass="w-full pr-10 placeholder:text-gray-400 placeholder:text-sm"
          :feedback="false"
          toggleMask
        />
      </div>
      <Button
        label="Masuk"
        class="w-full text-white font-semibold rounded-full shadow-lg transition-colors"
        rounded
        size="large"
        :loading="loading"
        @click="handleLogin"
      />
    </div>
    <div>
      <p class="text-xs">
        saya menyetujui
        <span class="underline text-blue-500">kententuan layanan</span> & dan
        <span class="underline text-blue-500">kebijakan privasi</span> SIGAP
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const { post } = useApi()
const router = useRouter()
const toast = useToast()

const username = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    toast.add({
      severity: 'warn',
      summary: 'Peringatan',
      detail: 'Mohon isi email dan password',
      life: 3000
    })
    return
  }

  loading.value = true
  
  try {
    const response = await post('/login', {
      email: username.value,
      password: password.value
    })
    
    if (response.success && response.data) {
      // Login berhasil
      login(response.data.user, response.data.token)
      
      toast.add({
        severity: 'success',
        summary: 'Berhasil',
        detail: response.message || 'Login berhasil',
        life: 3000
      })
      
      router.push('/')
    }
  } catch (error: any) {
    // Handle error
    const errorMessage = error.response?.message || error.message || 'Terjadi kesalahan saat login'
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
