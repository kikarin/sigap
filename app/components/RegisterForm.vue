<template>
  <div class="w-full">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-4 shadow-lg">
        <i class="pi pi-user-plus text-white text-2xl"></i>
      </div>
      <h1 class="font-bold text-3xl text-gray-800 mb-2">Buat Akun Baru</h1>
      <p class="text-sm text-gray-600">Daftar untuk mengakses layanan SIGAP</p>
    </div>

    <!-- Form Section -->
    <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div class="space-y-5">
        <!-- Nama Input -->
        <div class="flex flex-col gap-2">
          <label for="nama" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <i class="pi pi-user text-blue-500"></i>
            Nama Lengkap
          </label>
          <InputText
            id="nama"
            v-model="formData.nama"
            placeholder="Masukan nama lengkap"
            class="w-full placeholder:text-gray-400 placeholder:text-sm"
            :class="{ 'p-invalid': errors.nama }"
            aria-describedby="nama-help"
          />
          <small v-if="errors.nama" id="nama-help" class="p-error text-xs">{{ errors.nama }}</small>
        </div>

        <!-- NIK Input -->
        <div class="flex flex-col gap-2">
          <label for="nik" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <i class="pi pi-id-card text-blue-500"></i>
            NIK (Nomor Induk Kependudukan)
          </label>
          <InputText
            id="nik"
            v-model="formData.nik"
            placeholder="Masukan NIK (16 digit)"
            class="w-full placeholder:text-gray-400 placeholder:text-sm"
            :class="{ 'p-invalid': errors.nik }"
            maxlength="16"
            aria-describedby="nik-help"
          />
          <small v-if="errors.nik" id="nik-help" class="p-error text-xs">{{ errors.nik }}</small>
        </div>

        <!-- Email Input -->
        <div class="flex flex-col gap-2">
          <label for="email" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <i class="pi pi-envelope text-blue-500"></i>
            Email
          </label>
          <InputText
            id="email"
            v-model="formData.email"
            placeholder="Masukan email"
            type="email"
            class="w-full placeholder:text-gray-400 placeholder:text-sm"
            :class="{ 'p-invalid': errors.email }"
            aria-describedby="email-help"
          />
          <small v-if="errors.email" id="email-help" class="p-error text-xs">{{ errors.email }}</small>
        </div>

        <!-- Password Input -->
        <div class="flex flex-col gap-2">
          <label for="password" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <i class="pi pi-lock text-blue-500"></i>
            Password
          </label>
          <Password
            id="password"
            v-model="formData.password"
            placeholder="Masukan password (min. 6 karakter)"
            class="w-full"
            inputClass="w-full pr-10 placeholder:text-gray-400 placeholder:text-sm"
            :class="{ 'p-invalid': errors.password }"
            :feedback="true"
            toggleMask
          />
          <small v-if="errors.password" id="password-help" class="p-error text-xs">{{ errors.password }}</small>
        </div>

        <!-- Confirm Password Input -->
        <div class="flex flex-col gap-2">
          <label for="confirmPassword" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <i class="pi pi-lock text-blue-500"></i>
            Konfirmasi Password
          </label>
          <Password
            id="confirmPassword"
            v-model="formData.confirmPassword"
            placeholder="Konfirmasi password"
            class="w-full"
            inputClass="w-full pr-10 placeholder:text-gray-400 placeholder:text-sm"
            :class="{ 'p-invalid': errors.confirmPassword }"
            :feedback="false"
            toggleMask
          />
          <small v-if="errors.confirmPassword" id="confirmPassword-help" class="p-error text-xs">{{ errors.confirmPassword }}</small>
        </div>

        <!-- Submit Button -->
        <Button
          label="Daftar"
          icon="pi pi-user-plus"
          class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg transition-all duration-200"
          rounded
          size="large"
          :loading="loading"
          @click="handleRegister"
        />
      </div>
    </div>

    <!-- Terms & Privacy -->
    <div class="mt-6 text-center">
      <p class="text-xs text-gray-600 leading-relaxed">
        Dengan mendaftar, Anda menyetujui
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

    <!-- Login Link -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Sudah punya akun?
        <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-700 font-semibold">
          Masuk di sini
        </NuxtLink>
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
const errors = ref({
  nama: '',
  nik: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateForm = () => {
  errors.value = { nama: '', nik: '', email: '', password: '', confirmPassword: '' }
  let isValid = true

  if (!formData.value.nama) {
    errors.value.nama = 'Nama lengkap wajib diisi'
    isValid = false
  } else if (formData.value.nama.length < 3) {
    errors.value.nama = 'Nama minimal 3 karakter'
    isValid = false
  }

  if (!formData.value.nik) {
    errors.value.nik = 'NIK wajib diisi'
    isValid = false
  } else if (!/^\d{16}$/.test(formData.value.nik)) {
    errors.value.nik = 'NIK harus 16 digit angka'
    isValid = false
  }

  if (!formData.value.email) {
    errors.value.email = 'Email wajib diisi'
    isValid = false
  } else if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(formData.value.email)) {
    errors.value.email = 'Format email tidak valid'
    isValid = false
  }

  if (!formData.value.password) {
    errors.value.password = 'Password wajib diisi'
    isValid = false
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password minimal 6 karakter'
    isValid = false
  }

  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Konfirmasi password wajib diisi'
    isValid = false
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Password dan konfirmasi password tidak sama'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  errors.value = { nama: '', nik: '', email: '', password: '', confirmPassword: '' }
  
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
    const errorData = error.response?.errors
    
    if (errorData) {
      if (errorData.name || errorData.nama) {
        errors.value.nama = Array.isArray(errorData.name || errorData.nama) 
          ? (errorData.name || errorData.nama)[0] 
          : (errorData.name || errorData.nama)
      }
      if (errorData.nik) {
        errors.value.nik = Array.isArray(errorData.nik) ? errorData.nik[0] : errorData.nik
      }
      if (errorData.email) {
        errors.value.email = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email
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
