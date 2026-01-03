<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-y-auto px-4 pb-32">
      <div class="flex items-center gap-3 mb-6">
        <h1 class="font-semibold text-xl text-gray-800">Verifikasi Dokumen</h1>
      </div>

      <div class="space-y-5">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <i class="pi pi-info-circle text-blue-600 mt-0.5"></i>
            <div class="flex-1">
              <p class="text-sm text-blue-800 font-medium mb-1">Tanda Tangan Digital</p>
              <p class="text-xs text-blue-700">
                Tandatangani dokumen dengan menulis di area canvas di bawah ini. Pastikan tanda tangan jelas dan sesuai dengan identitas Anda.
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-gray-700 text-sm font-medium">
            Tanda Tangan Digital <span class="text-red-500">*</span>
          </label>
          
          <!-- Canvas Area -->
          <div class="border-2 border-gray-300 rounded-lg p-4 bg-white">
            <canvas
              ref="canvasRef"
              @mousedown="startDrawing"
              @mousemove="draw"
              @mouseup="stopDrawing"
              @mouseleave="stopDrawing"
              @touchstart="startDrawingTouch"
              @touchmove="drawTouch"
              @touchend="stopDrawing"
              class="w-full border border-gray-200 rounded bg-white cursor-crosshair"
              style="touch-action: none;"
            ></canvas>
          </div>

          <div class="flex items-center justify-between">
            <button
              @click="clearCanvas"
              class="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-2"
            >
              <i class="pi pi-trash"></i>
              Hapus Tanda Tangan
            </button>
          </div>

          <div v-if="signatureDataUrl" class="mt-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-600 mb-2">Preview Tanda Tangan:</p>
            <img :src="signatureDataUrl" alt="Preview Tanda Tangan" class="max-w-full h-24 object-contain bg-white border border-gray-200 rounded" />
          </div>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <i class="pi pi-exclamation-triangle text-yellow-600 mt-0.5"></i>
            <div class="flex-1">
              <p class="text-xs text-yellow-800">
                Dengan menandatangani, Anda menyetujui bahwa semua informasi yang diberikan adalah benar dan dapat dipertanggungjawabkan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 border-t border-gray-200 shadow-lg z-50 max-w-md mx-auto">
      <button
        @click="handleSubmit"
        :disabled="!hasSignature || loading"
        class="w-full rounded-full text-white font-bold bg-primary-500 p-3 hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <span v-if="loading">Mengirim...</span>
        <span v-else>Kirim Proposal</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useProposal } from '@/composables/useProposal'
import { useProposalForm } from '@/composables/useProposalForm'

const router = useRouter()
const toast = useToast()
const { createPengajuanProposal } = useProposal()
const { formData, resetForm } = useProposalForm()

const canvasRef = ref(null);
const isDrawing = ref(false);
const signatureDataUrl = ref(null);
const hasSignature = ref(false);
const loading = ref(false);

let canvas = null;
let ctx = null;

const initCanvas = () => {
  if (!canvasRef.value) return;

  canvas = canvasRef.value;
  ctx = canvas.getContext('2d');
  
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = 300; 
  
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const getCoordinates = (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
};

const getTouchCoordinates = (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const touch = e.touches[0] || e.changedTouches[0];
  
  return {
    x: (touch.clientX - rect.left) * scaleX,
    y: (touch.clientY - rect.top) * scaleY
  };
};

let lastX = 0;
let lastY = 0;

const startDrawing = (e) => {
  isDrawing.value = true;
  const coords = getCoordinates(e);
  lastX = coords.x;
  lastY = coords.y;
};

const startDrawingTouch = (e) => {
  e.preventDefault();
  isDrawing.value = true;
  const coords = getTouchCoordinates(e);
  lastX = coords.x;
  lastY = coords.y;
};

const draw = (e) => {
  if (!isDrawing.value || !ctx) return;
  
  const coords = getCoordinates(e);
  
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(coords.x, coords.y);
  ctx.stroke();
  
  lastX = coords.x;
  lastY = coords.y;
  
  hasSignature.value = true;
  updateSignaturePreview();
};

const drawTouch = (e) => {
  e.preventDefault();
  if (!isDrawing.value || !ctx) return;
  
  const coords = getTouchCoordinates(e);
  
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(coords.x, coords.y);
  ctx.stroke();
  
  lastX = coords.x;
  lastY = coords.y;
  
  hasSignature.value = true;
  updateSignaturePreview();
};

const stopDrawing = () => {
  if (isDrawing.value) {
    isDrawing.value = false;
    updateSignaturePreview();
  }
};

const clearCanvas = () => {
  if (!ctx || !canvas) return;
  
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  hasSignature.value = false;
  signatureDataUrl.value = null;
};

const updateSignaturePreview = () => {
  if (!canvas) return;
  signatureDataUrl.value = canvas.toDataURL('image/png');
};

const goBack = () => {
  router.back()
}

const handleSubmit = async () => {
  if (!hasSignature.value) {
    toast.add({
      severity: 'warn',
      summary: 'Peringatan',
      detail: 'Mohon buat tanda tangan terlebih dahulu',
      life: 3000
    });
    return;
  }

  loading.value = true;

  try {
    if (!formData.value.kategori_proposal_id || !formData.value.nama_kegiatan || !formData.value.deskripsi_kegiatan || !formData.value.usulan_anggaran || !formData.value.latitude || !formData.value.longitude || !formData.value.nama_lokasi || !formData.value.alamat || !formData.value.thumbnail_foto_banner) {
      toast.add({
        severity: 'warn',
        summary: 'Peringatan',
        detail: 'Mohon lengkapi semua data proposal',
        life: 3000
      })
      return
    }

    const signature = canvas.toDataURL('image/png')

    const proposalData = {
      kategori_proposal_id: formData.value.kategori_proposal_id,
      nomor_telepon_pengaju: formData.value.nomor_telepon_pengaju || undefined,
      nama_kegiatan: formData.value.nama_kegiatan,
      deskripsi_kegiatan: formData.value.deskripsi_kegiatan,
      usulan_anggaran: formData.value.usulan_anggaran,
      file_pendukung: formData.value.file_pendukung.length > 0 ? formData.value.file_pendukung : undefined,
      latitude: formData.value.latitude,
      longitude: formData.value.longitude,
      nama_lokasi: formData.value.nama_lokasi,
      alamat: formData.value.alamat,
      thumbnail_foto_banner: formData.value.thumbnail_foto_banner,
      tanda_tangan_digital: signature
    }
    
    await createPengajuanProposal(proposalData)

    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Proposal berhasil dikirim',
      life: 3000
    })

    resetForm()

    setTimeout(() => {
      router.push('/services/proposal')
    }, 1500)
  } catch (error) {
    const err = error || {};
    const errorMessage = (err.response && err.response.message) || err.message || 'Terjadi kesalahan saat mengirim proposal';
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: errorMessage,
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await nextTick();
  initCanvas();
});

definePageMeta({
  layout: "complaint-layout",
});
</script>

<style scoped>
canvas {
  display: block;
}
</style>

