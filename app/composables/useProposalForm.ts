export const useProposalForm = () => {
  const formData = useState('proposal-form-data', () => ({
    kategori_proposal_id: null as number | null,
    nomor_telepon_pengaju: '',
    nama_kegiatan: '',
    deskripsi_kegiatan: '',
    usulan_anggaran: null as number | null,
    file_pendukung: [] as File[],
    latitude: null as number | null,
    longitude: null as number | null,
    nama_lokasi: '',
    alamat: '',
    thumbnail_foto_banner: null as File | null,
    tanda_tangan_digital: null as string | null
  }))

  const resetForm = () => {
    formData.value = {
      kategori_proposal_id: null,
      nomor_telepon_pengaju: '',
      nama_kegiatan: '',
      deskripsi_kegiatan: '',
      usulan_anggaran: null,
      file_pendukung: [],
      latitude: null,
      longitude: null,
      nama_lokasi: '',
      alamat: '',
      thumbnail_foto_banner: null,
      tanda_tangan_digital: null
    }
  }

  return {
    formData,
    resetForm
  }
}

