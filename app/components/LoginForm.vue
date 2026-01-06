<template>
  <div class="w-full">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mb-4 shadow-lg">
        <i class="pi pi-sign-in text-white text-2xl"></i>
      </div>
      <h1 class="font-bold text-3xl text-gray-800 mb-2">Selamat Datang</h1>
      <p class="text-sm text-gray-600">Masuk ke akun SIGAP Anda</p>
    </div>

    <!-- Form Section -->
    <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div class="space-y-5">
        <!-- Email/Phone Input -->
        <div class="flex flex-col gap-2">
          <label for="username" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <i class="pi pi-user text-blue-500"></i>
            Nomor HP / Email
          </label>
          <InputText
            id="username"
            v-model="username"
            placeholder="Masukan no hp atau email"
            class="w-full"
            :class="{ 'p-invalid': errors.username }"
            aria-describedby="username-help"
          />
          <small v-if="errors.username" id="username-help" class="p-error text-xs">{{ errors.username }}</small>
        </div>

        <!-- Password Input -->
        <div class="flex flex-col gap-2">
          <label for="password" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <i class="pi pi-lock text-blue-500"></i>
            Password
          </label>
          <Password
            id="password"
            v-model="password"
            placeholder="Masukan password"
            class="w-full"
            inputClass="w-full pr-10 placeholder:text-gray-400 placeholder:text-sm"
            :class="{ 'p-invalid': errors.password }"
            :feedback="false"
            toggleMask
          />
          <small v-if="errors.password" id="password-help" class="p-error text-xs">{{ errors.password }}</small>
        </div>

        <!-- Forgot Password Link -->
        <div class="flex justify-end">
          <button class="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Lupa Password?
          </button>
        </div>

        <!-- Submit Button -->
        <Button
          label="Masuk"
          icon="pi pi-sign-in"
          class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg transition-all duration-200"
          rounded
          size="large"
          :loading="loading"
          @click="handleLogin"
        />
      </div>
    </div>

    <!-- Terms & Privacy -->
    <div class="mt-6 text-center">
      <p class="text-xs text-gray-600 leading-relaxed">
        Dengan masuk, Anda menyetujui
        <button @click="router.push('/profile/syarat-ketentuan')" class="text-blue-600 hover:text-blue-700 font-medium underline">
          Syarat & Ketentuan
        </button>
        dan
        <button @click="router.push('/profile/kebijakan-privasi')" class="text-blue-600 hover:text-blue-700 font-medium underline">
          Kebijakan Privasi
        </button>
        SIGAP
      </p>
    </div>

    <!-- Register Link -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Belum punya akun?
        <NuxtLink to="/auth/register" class="text-blue-600 hover:text-blue-700 font-semibold">
          Daftar Sekarang
        </NuxtLink>
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
const errors = ref({
  username: '',
  password: ''
})

const validateForm = () => {
  errors.value = { username: '', password: '' }
  let isValid = true

  if (!username.value) {
    errors.value.username = 'Nomor HP atau Email wajib diisi'
    isValid = false
  } else if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(username.value) && !/^[0-9+\-\s()]+$/.test(username.value)) {
    errors.value.username = 'Format email atau nomor HP tidak valid'
    isValid = false
  }

  if (!password.value) {
    errors.value.password = 'Password wajib diisi'
    isValid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'Password minimal 6 karakter'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  errors.value = { username: '', password: '' }
  
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
    const errorData = error.response?.errors
    
    if (errorData) {
      if (errorData.email) {
        errors.value.username = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email
      }
      if (errorData.password) {
        errors.value.password = Array.isArray(errorData.password) ? errorData.password[0] : errorData.password
      }
    }
    
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: errorData ? Object.values(errorData).flat().join(', ') : errorMessage,
      life: 5000
    })
  } finally {
    loading.value = false
  }
}
</script>
