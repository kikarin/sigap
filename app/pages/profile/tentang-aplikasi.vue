<template>
  <div class="px-5 py-4">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/profile" class="flex-shrink-0">
        <i class="pi pi-arrow-left text-xl text-gray-700"></i>
      </NuxtLink>
      <div>
        <h1 class="text-xl font-bold text-gray-800">Tentang Aplikasi</h1>
        <p class="text-xs text-gray-500">SIGAP - Sistem Informasi Galuga Pintar</p>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-6 pb-6">
      <!-- Hero Section -->
      <Card class="border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <template #content>
          <div class="text-center py-6">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg">
              <i class="pi pi-mobile text-white text-3xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">SIGAP</h2>
            <p class="text-base text-gray-700 font-semibold mb-1">Sistem Informasi Galuga Pintar</p>
            <p class="text-sm text-gray-600">Versi {{ version }}</p>
          </div>
        </template>
      </Card>

      <!-- About -->
      <Card class="border border-gray-200">
        <template #content>
          <div class="prose prose-sm max-w-none">
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <i class="pi pi-info-circle text-blue-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Tentang SIGAP</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed mb-3">
                SIGAP (Sistem Informasi Galuga Pintar) adalah aplikasi layanan publik digital yang dikembangkan untuk 
                memudahkan warga Kabupaten Bogor dalam mengakses berbagai layanan pemerintahan secara online. 
                Aplikasi ini dirancang untuk meningkatkan efisiensi, transparansi, dan kualitas pelayanan publik.
              </p>
              <p class="text-sm text-gray-700 leading-relaxed">
                Dengan SIGAP, warga dapat mengajukan berbagai layanan, mengakses informasi, dan berinteraksi dengan 
                pemerintah daerah secara lebih mudah dan cepat tanpa harus datang langsung ke kantor.
              </p>
            </div>
          </div>
        </template>
      </Card>

      <!-- Features -->
      <Card class="border border-gray-200">
        <template #content>
          <div class="prose prose-sm max-w-none">
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <i class="pi pi-star text-green-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Fitur Utama</h2>
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <i class="pi pi-file text-blue-600 mt-1"></i>
                  <div>
                    <h3 class="text-base font-semibold text-gray-800 mb-1">Layanan Surat Menyurat</h3>
                    <p class="text-sm text-gray-700">Ajukan berbagai jenis surat secara online dengan mudah dan cepat</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <i class="pi pi-comment text-orange-600 mt-1"></i>
                  <div>
                    <h3 class="text-base font-semibold text-gray-800 mb-1">Pengaduan Masyarakat</h3>
                    <p class="text-sm text-gray-700">Laporkan masalah atau keluhan Anda dengan sistem tracking yang transparan</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <i class="pi pi-gift text-purple-600 mt-1"></i>
                  <div>
                    <h3 class="text-base font-semibold text-gray-800 mb-1">Program Bantuan</h3>
                    <p class="text-sm text-gray-700">Akses informasi dan ajukan program bantuan pemerintah</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <i class="pi pi-briefcase text-teal-600 mt-1"></i>
                  <div>
                    <h3 class="text-base font-semibold text-gray-800 mb-1">Proposal Kegiatan</h3>
                    <p class="text-sm text-gray-700">Ajukan proposal kegiatan dengan proses yang terstruktur</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <i class="pi pi-bell text-red-600 mt-1"></i>
                  <div>
                    <h3 class="text-base font-semibold text-gray-800 mb-1">Berita & Pengumuman</h3>
                    <p class="text-sm text-gray-700">Dapatkan informasi terbaru dari pemerintah daerah</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <i class="pi pi-exclamation-triangle text-yellow-600 mt-1"></i>
                  <div>
                    <h3 class="text-base font-semibold text-gray-800 mb-1">Layanan Darurat</h3>
                    <p class="text-sm text-gray-700">Akses cepat ke layanan darurat dan bantuan darurat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Vision Mission -->
      <Card class="border border-gray-200">
        <template #content>
          <div class="prose prose-sm max-w-none">
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <i class="pi pi-eye text-indigo-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Visi & Misi</h2>
              </div>
              <div class="space-y-4">
                <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 class="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <i class="pi pi-bullseye text-blue-600"></i>
                    Visi
                  </h3>
                  <p class="text-sm text-gray-700 leading-relaxed">
                    Menjadi platform digital terdepan dalam menyediakan layanan publik yang mudah, cepat, 
                    dan transparan untuk seluruh warga Kabupaten Bogor.
                  </p>
                </div>
                <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 class="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <i class="pi pi-flag text-green-600"></i>
                    Misi
                  </h3>
                  <ul class="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                    <li>Menyediakan akses layanan publik yang mudah dan terjangkau</li>
                    <li>Meningkatkan transparansi dan akuntabilitas pelayanan</li>
                    <li>Mempercepat proses administrasi dan pelayanan</li>
                    <li>Membangun komunikasi yang efektif antara pemerintah dan masyarakat</li>
                    <li>Mendorong partisipasi aktif warga dalam pembangunan daerah</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Benefits -->
      <Card class="border border-gray-200">
        <template #content>
          <div class="prose prose-sm max-w-none">
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <i class="pi pi-check-square text-yellow-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Keuntungan Menggunakan SIGAP</h2>
              </div>
              <div class="grid grid-cols-1 gap-3">
                <div class="flex items-center gap-3">
                  <i class="pi pi-check-circle text-green-600"></i>
                  <p class="text-sm text-gray-700">Akses layanan 24/7 tanpa harus datang ke kantor</p>
                </div>
                <div class="flex items-center gap-3">
                  <i class="pi pi-check-circle text-green-600"></i>
                  <p class="text-sm text-gray-700">Proses lebih cepat dan efisien</p>
                </div>
                <div class="flex items-center gap-3">
                  <i class="pi pi-check-circle text-green-600"></i>
                  <p class="text-sm text-gray-700">Tracking status pengajuan secara real-time</p>
                </div>
                <div class="flex items-center gap-3">
                  <i class="pi pi-check-circle text-green-600"></i>
                  <p class="text-sm text-gray-700">Mengurangi biaya transportasi dan waktu</p>
                </div>
                <div class="flex items-center gap-3">
                  <i class="pi pi-check-circle text-green-600"></i>
                  <p class="text-sm text-gray-700">Informasi terpusat dan mudah diakses</p>
                </div>
                <div class="flex items-center gap-3">
                  <i class="pi pi-check-circle text-green-600"></i>
                  <p class="text-sm text-gray-700">Layanan yang transparan dan akuntabel</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Technology -->
      <Card class="border border-gray-200">
        <template #content>
          <div class="prose prose-sm max-w-none">
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <i class="pi pi-code text-purple-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Teknologi</h2>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed mb-3">
                SIGAP dibangun dengan teknologi modern untuk memastikan keamanan, kecepatan, dan kenyamanan pengguna:
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Secure</span>
                <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Fast</span>
                <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Responsive</span>
                <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">User-Friendly</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Contact -->
      <Card class="border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <template #content>
          <div class="prose prose-sm max-w-none">
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <i class="pi pi-phone text-blue-600"></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800 m-0">Hubungi Kami</h2>
              </div>
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <i class="pi pi-envelope text-blue-600 mt-1"></i>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">Email</p>
                    <p class="text-sm text-gray-700">info@sigap.go.id</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <i class="pi pi-phone text-blue-600 mt-1"></i>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">Telepon</p>
                    <p class="text-sm text-gray-700">(0251) 1234567</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <i class="pi pi-map-marker text-blue-600 mt-1"></i>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">Alamat</p>
                    <p class="text-sm text-gray-700">Jl. Raya Galuga, Kabupaten Bogor, Jawa Barat</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <i class="pi pi-clock text-blue-600 mt-1"></i>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">Jam Layanan</p>
                    <p class="text-sm text-gray-700">Senin - Jumat: 08:00 - 16:00 WIB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Version Info -->
      <div class="text-center py-4">
        <p class="text-xs text-gray-400">© 2024 SIGAP - Sistem Informasi Galuga Pintar</p>
        <p class="text-xs text-gray-400 mt-1">Dikelola oleh Pemerintah Kabupaten Bogor</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card } from "primevue";

definePageMeta({
  layout: "default",
});

const version = ref("1.0.0");
</script>

