<template>
  <div class="px-5 py-4">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/profile" class="flex-shrink-0">
        <i class="pi pi-arrow-left text-xl text-gray-700"></i>
      </NuxtLink>
      <div>
        <h1 class="text-xl font-bold text-gray-800">Syarat & Ketentuan</h1>
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
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <i class="pi pi-file text-blue-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Pengenalan</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed">
                Selamat datang di SIGAP (Sistem Informasi Galuga Pintar). Dengan mengakses dan menggunakan aplikasi ini, 
                Anda menyetujui untuk terikat oleh Syarat & Ketentuan berikut. Jika Anda tidak setuju dengan ketentuan ini, 
                mohon untuk tidak menggunakan aplikasi SIGAP.
              </p>
            </div>

            <!-- Acceptance -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <i class="pi pi-check-circle text-green-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Penerimaan Ketentuan</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed">
                Dengan membuat akun atau menggunakan aplikasi SIGAP, Anda menyatakan bahwa:
              </p>
              <ul class="list-disc list-inside text-sm text-gray-700 space-y-2 ml-4 mt-3">
                <li>Anda telah membaca, memahami, dan menyetujui Syarat & Ketentuan ini</li>
                <li>Anda berusia minimal 17 tahun atau telah mendapat persetujuan dari wali</li>
                <li>Informasi yang Anda berikan adalah akurat dan benar</li>
                <li>Anda bertanggung jawab atas semua aktivitas yang terjadi di akun Anda</li>
              </ul>
            </div>

            <!-- Account -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <i class="pi pi-user text-purple-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Akun Pengguna</h2>
              </div>
              <div class="space-y-3">
                <div>
                  <h3 class="text-base font-semibold text-gray-800 mb-2">1. Registrasi</h3>
                  <ul class="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                    <li>Anda harus memberikan informasi yang akurat dan lengkap saat registrasi</li>
                    <li>Setiap pengguna hanya diperbolehkan memiliki satu akun</li>
                    <li>NIK yang digunakan harus valid dan sesuai dengan identitas Anda</li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-base font-semibold text-gray-800 mb-2">2. Keamanan Akun</h3>
                  <ul class="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                    <li>Anda bertanggung jawab menjaga kerahasiaan password</li>
                    <li>Segera laporkan jika akun Anda diretas atau digunakan tanpa izin</li>
                    <li>Kami tidak bertanggung jawab atas kerugian akibat kelalaian Anda menjaga keamanan akun</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Services -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <i class="pi pi-briefcase text-yellow-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Penggunaan Layanan</h2>
              </div>
              <div class="space-y-3">
                <div>
                  <h3 class="text-base font-semibold text-gray-800 mb-2">Layanan yang Tersedia</h3>
                  <p class="text-sm text-gray-700 leading-relaxed mb-2">
                    SIGAP menyediakan berbagai layanan publik termasuk:
                  </p>
                  <ul class="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                    <li>Layanan surat menyurat</li>
                    <li>Pengaduan masyarakat</li>
                    <li>Program bantuan</li>
                    <li>Proposal kegiatan</li>
                    <li>Berita dan pengumuman</li>
                    <li>Layanan darurat</li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-base font-semibold text-gray-800 mb-2">Kewajiban Pengguna</h3>
                  <ul class="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                    <li>Menggunakan layanan sesuai dengan tujuan yang diizinkan</li>
                    <li>Tidak menyalahgunakan layanan untuk tujuan ilegal</li>
                    <li>Memberikan informasi yang benar dan akurat</li>
                    <li>Menghormati hak pengguna lain</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Prohibited -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <i class="pi pi-ban text-red-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Larangan</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed mb-3">
                Anda dilarang untuk:
              </p>
              <ul class="list-disc list-inside text-sm text-gray-700 space-y-2 ml-4">
                <li>Menggunakan aplikasi untuk tujuan ilegal atau melanggar hukum</li>
                <li>Mengirimkan konten yang mengandung virus, malware, atau kode berbahaya</li>
                <li>Melakukan tindakan yang dapat merusak atau mengganggu sistem</li>
                <li>Menggunakan identitas atau data orang lain tanpa izin</li>
                <li>Melakukan spam, phishing, atau penipuan</li>
                <li>Mengakses atau mencoba mengakses akun pengguna lain</li>
                <li>Menggunakan bot atau script otomatis tanpa izin</li>
              </ul>
            </div>

            <!-- Intellectual Property -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <i class="pi pi-copyright text-indigo-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Hak Kekayaan Intelektual</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed">
                Semua konten dalam aplikasi SIGAP, termasuk logo, desain, teks, dan fitur, dilindungi oleh hak cipta dan 
                hak kekayaan intelektual lainnya. Anda tidak diperbolehkan untuk menyalin, memodifikasi, atau mendistribusikan 
                konten tanpa izin tertulis dari kami.
              </p>
            </div>

            <!-- Limitation -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <i class="pi pi-exclamation-triangle text-gray-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Pembatasan Tanggung Jawab</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed mb-3">
                SIGAP menyediakan layanan "sebagaimana adanya". Kami tidak menjamin:
              </p>
              <ul class="list-disc list-inside text-sm text-gray-700 space-y-2 ml-4">
                <li>Layanan akan selalu tersedia tanpa gangguan</li>
                <li>Layanan bebas dari kesalahan atau bug</li>
                <li>Hasil yang diperoleh dari penggunaan layanan akan memenuhi harapan Anda</li>
              </ul>
              <p class="text-sm text-gray-700 leading-relaxed mt-3">
                Kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, atau konsekuensial yang timbul dari 
                penggunaan atau ketidakmampuan menggunakan aplikasi.
              </p>
            </div>

            <!-- Termination -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <i class="pi pi-times-circle text-orange-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Penghentian Akun</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed mb-3">
                Kami berhak untuk menghentikan atau menangguhkan akun Anda jika:
              </p>
              <ul class="list-disc list-inside text-sm text-gray-700 space-y-2 ml-4">
                <li>Anda melanggar Syarat & Ketentuan ini</li>
                <li>Anda melakukan aktivitas ilegal atau mencurigakan</li>
                <li>Akun Anda tidak aktif dalam jangka waktu tertentu</li>
                <li>Atas permintaan Anda sendiri</li>
              </ul>
            </div>

            <!-- Changes -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <i class="pi pi-sync text-teal-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Perubahan Ketentuan</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed">
                Kami berhak mengubah Syarat & Ketentuan ini kapan saja. Perubahan akan diberitahukan melalui aplikasi. 
                Penggunaan aplikasi setelah perubahan berarti Anda menyetujui ketentuan yang diperbarui.
              </p>
            </div>

            <!-- Governing Law -->
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <i class="pi pi-gavel text-pink-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Hukum yang Berlaku</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed">
                Syarat & Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. 
                Setiap sengketa akan diselesaikan melalui pengadilan yang berwenang di Kabupaten Bogor.
              </p>
            </div>

            <!-- Contact -->
            <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div class="flex items-start gap-3">
                <i class="pi pi-phone text-blue-600 mt-1"></i>
                <div>
                  <h3 class="text-base font-semibold text-gray-800 mb-2">Kontak</h3>
                  <p class="text-sm text-gray-700 leading-relaxed mb-2">
                    Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami:
                  </p>
                  <div class="space-y-1 text-sm text-gray-700">
                    <p><strong>Email:</strong> support@sigap.go.id</p>
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

