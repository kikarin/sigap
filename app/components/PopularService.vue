<template>
  <div class="relative h-96 -mt-4 px-4 z-20">
    <div class="bg-white overflow-y-scroll rounded-t-2xl h-full flex flex-col gap-5  shadow-lg p-6 mx-auto max-w-md">
      <div>
        <h2 class="font-bold text-lg text-gray-800 mb-1">
          Layanan Populer
        </h2>
        <p class="text-sm text-gray-600">
          Jelajahi layanan publik yang sering digunakan oleh masyarakat
        </p>
      </div>
      <div
        v-for="service in services"
        :key="service.id"
        class="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          :class="service.bgColor"
        >
          <i :class="[service.icon, service.iconColor, 'text-xl']"></i>
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-gray-800 mb-1">
            {{ service.title }}
          </h3>
          <p class="text-xs text-gray-600 leading-relaxed">
            {{ service.description }}
          </p>
        </div>
        <i class="pi pi-chevron-right text-gray-400 text-sm"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const services = [
  {
    id: 1,
    title: "Aduan Mayarakat",
    description:
      "Sampaikan keluhan atau laporan Kamu agar dapat ditindaklanjuti dengan cepat.",
    icon: "pi pi-megaphone",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    title: "Buat KTP Baru",
    description:
      "Isi data diri Kamu secara online untuk memulai proses pembuatan KTP baru tanpa antre.",
    icon: "pi pi-id-card",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 3,
    title: "Buat Akta Kelahiran",
    description: "Buat dan tanda tangani surat pengantar secara online",
    icon: "pi pi-file-edit",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 4,
    title: "Bayar Pajak Kendaraan",
    description:
      "Bayar pajak kendaraan Anda secara mudah, cepat dan dari aplikasi",
    icon: "pi pi-car",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 5,
    title: "Izin Usaha",
    description:
      "Ajukan permohonan izin usaha secara online tanpa perlu datang ke kantor",
    icon: "pi pi-briefcase",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 6,
    title: "Surat Keterangan Domisili",
    description:
      "Buat surat keterangan domisili untuk keperluan administrasi Anda",
    icon: "pi pi-home",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: 7,
    title: "Layanan Kesehatan",
    description:
      "Akses informasi layanan kesehatan dan fasilitas rumah sakit terdekat",
    icon: "pi pi-heart",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: 8,
    title: "Informasi Bantuan Sosial",
    description: "Cek status dan informasi program bantuan sosial pemerintah",
    icon: "pi pi-users",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: 9,
    title: "Pendaftaran Sekolah",
    description:
      "Daftarkan anak Anda ke sekolah negeri secara online dengan mudah",
    icon: "pi pi-book",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    id: 10,
    title: "Laporan Kerusakan Fasilitas",
    description: "Laporkan kerusakan fasilitas umum di lingkungan Anda",
    icon: "pi pi-wrench",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
];
</script>
