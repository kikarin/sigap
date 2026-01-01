export const useAduanForm = () => {
  const formData = useState('aduan-form-data', () => ({
    id: null as number | null,
    kategori_aduan_id: null as number | null,
    judul: '',
    detail_aduan: '',
    latitude: null as number | null,
    longitude: null as number | null,
    nama_lokasi: '',
    kecamatan_id: null as number | null,
    desa_id: null as number | null,
    deskripsi_lokasi: '',
    jenis_aduan: 'publik' as string,
    alasan_melaporkan: '',
    files: [] as File[],
    existingFiles: [] as any[],
    deletedFiles: [] as number[]
  }))

  const resetForm = () => {
    formData.value = {
      id: null,
      kategori_aduan_id: null,
      judul: '',
      detail_aduan: '',
      latitude: null,
      longitude: null,
      nama_lokasi: '',
      kecamatan_id: null,
      desa_id: null,
      deskripsi_lokasi: '',
      jenis_aduan: 'publik',
      alasan_melaporkan: '',
      files: [],
      existingFiles: [],
      deletedFiles: []
    }
  }

  const loadFormData = (data: any) => {
    formData.value = {
      id: data.id || null,
      kategori_aduan_id: data.kategori_aduan_id || null,
      judul: data.judul || '',
      detail_aduan: data.detail_aduan || '',
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      nama_lokasi: data.nama_lokasi || '',
      kecamatan_id: data.kecamatan_id || null,
      desa_id: data.desa_id || null,
      deskripsi_lokasi: data.deskripsi_lokasi || '',
      jenis_aduan: data.jenis_aduan || 'publik',
      alasan_melaporkan: data.alasan_melaporkan || '',
      files: [],
      existingFiles: data.files || [],
      deletedFiles: []
    }
  }

  return {
    formData,
    resetForm,
    loadFormData
  }
}

