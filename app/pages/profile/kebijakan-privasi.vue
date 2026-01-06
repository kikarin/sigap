<template>
  <div class="px-5 py-4">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/profile" class="flex-shrink-0">
        <i class="pi pi-arrow-left text-xl text-gray-700"></i>
      </NuxtLink>
      <div>
        <h1 class="text-xl font-bold text-gray-800">Kebijakan Privasi</h1>
        <p class="text-xs text-gray-500">Terakhir diperbarui: {{ lastUpdated }}</p>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-6 pb-6">
      <Card class="border border-gray-200">
        <template #content>
          <div class="prose prose-sm max-w-none">
            <!-- Introduction -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <i class="pi pi-shield text-green-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Pengenalan</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed">
                SIGAP (Sistem Informasi Galuga Pintar) berkomitmen untuk melindungi privasi dan keamanan data pribadi pengguna. 
                Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda 
                saat menggunakan aplikasi SIGAP.
              </p>
            </div>

            <!-- Data Collection -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <i class="pi pi-database text-blue-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Data yang Kami Kumpulkan</h2>
              </div>
              <div class="space-y-3">
                <div>
                  <h3 class="text-base font-semibold text-gray-800 mb-2">1. Data Identitas</h3>
                  <ul class="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                    <li>Nama lengkap</li>
                    <li>Nomor Induk Kependudukan (NIK)</li>
                    <li>Email</li>
                    <li>Nomor telepon</li>
                    <li>Tempat dan tanggal lahir</li>
                    <li>Jenis kelamin</li>
                    <li>Nomor Kartu Keluarga (KK)</li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-base font-semibold text-gray-800 mb-2">2. Data Penggunaan</h3>
                  <ul class="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                    <li>Riwayat penggunaan layanan</li>
                    <li>Data lokasi (jika diperlukan untuk layanan tertentu)</li>
                    <li>Log aktivitas dalam aplikasi</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Data Usage -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <i class="pi pi-cog text-purple-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Penggunaan Data</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed mb-3">
                Data yang kami kumpulkan digunakan untuk:
              </p>
              <ul class="list-disc list-inside text-sm text-gray-700 space-y-2 ml-4">
                <li>Menyediakan dan meningkatkan layanan publik</li>
                <li>Memverifikasi identitas pengguna</li>
                <li>Memproses permohonan layanan</li>
                <li>Mengirimkan notifikasi dan informasi penting</li>
                <li>Meningkatkan keamanan aplikasi</li>
                <li>Memenuhi kewajiban hukum dan regulasi</li>
                <li>Menganalisis penggunaan aplikasi untuk perbaikan layanan</li>
              </ul>
            </div>

            <!-- Data Protection -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <i class="pi pi-lock text-red-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Perlindungan Data</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed mb-3">
                Kami menerapkan berbagai langkah keamanan untuk melindungi data pribadi Anda:
              </p>
              <ul class="list-disc list-inside text-sm text-gray-700 space-y-2 ml-4">
                <li>Enkripsi data dalam transmisi dan penyimpanan</li>
                <li>Kontrol akses yang ketat terhadap data pribadi</li>
                <li>Pemantauan keamanan secara berkala</li>
                <li>Backup data secara rutin</li>
                <li>Pelatihan keamanan untuk staf yang mengelola data</li>
              </ul>
            </div>

            <!-- Data Sharing -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <i class="pi pi-share-alt text-yellow-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Pembagian Data</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed mb-3">
                Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga. Data hanya dapat dibagikan dalam kondisi berikut:
              </p>
              <ul class="list-disc list-inside text-sm text-gray-700 space-y-2 ml-4">
                <li>Dengan persetujuan Anda</li>
                <li>Untuk memenuhi kewajiban hukum atau perintah pengadilan</li>
                <li>Dengan instansi pemerintah terkait untuk keperluan layanan publik</li>
                <li>Dengan penyedia layanan yang membantu operasional aplikasi (dengan perjanjian kerahasiaan)</li>
              </ul>
            </div>

            <!-- User Rights -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <i class="pi pi-user-edit text-teal-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Hak Pengguna</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed mb-3">
                Anda memiliki hak untuk:
              </p>
              <ul class="list-disc list-inside text-sm text-gray-700 space-y-2 ml-4">
                <li>Mengakses data pribadi Anda</li>
                <li>Memperbarui atau memperbaiki data pribadi</li>
                <li>Meminta penghapusan data pribadi (sesuai ketentuan hukum)</li>
                <li>Menolak pengolahan data tertentu</li>
                <li>Mengajukan keluhan terkait privasi data</li>
              </ul>
            </div>

            <!-- Cookies -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <i class="pi pi-cookie text-indigo-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Cookies dan Teknologi Serupa</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed">
                Aplikasi SIGAP menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman pengguna, 
                menganalisis penggunaan aplikasi, dan menjaga keamanan. Anda dapat mengatur preferensi cookies melalui pengaturan aplikasi.
              </p>
            </div>

            <!-- Changes -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <i class="pi pi-info-circle text-orange-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Perubahan Kebijakan</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed">
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diberitahukan melalui aplikasi 
                atau email. Penggunaan aplikasi setelah perubahan berarti Anda menyetujui kebijakan yang diperbarui.
              </p>
            </div>

            <!-- Contact -->
            <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div class="flex items-start gap-3">
                <i class="pi pi-phone text-blue-600 mt-1"></i>
                <div>
                  <h3 class="text-base font-semibold text-gray-800 mb-2">Kontak</h3>
                  <p class="text-sm text-gray-700 leading-relaxed mb-2">
                    Jika Anda memiliki pertanyaan atau keluhan terkait kebijakan privasi ini, silakan hubungi kami:
                  </p>
                  <div class="space-y-1 text-sm text-gray-700">
                    <p><strong>Email:</strong> privacy@sigap.go.id</p>
                    <p><strong>Telepon:</strong> (0251) 1234567</p>
                    <p><strong>Alamat:</strong> Jl. Raya Galuga, Kabupaten Bogor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card } from "primevue";

definePageMeta({
  layout: "default",
});

const lastUpdated = ref("7 Januari 2026");
</script>

