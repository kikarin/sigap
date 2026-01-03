import { useApi } from './useApi'

export const useProposal = () => {
  const { get, post, del } = useApi()

  const getKategoriProposal = async () => {
    return get('/pengajuan-proposal/kategori')
  }

  const getListPengajuanProposal = async (params?: {
    page?: number
    per_page?: number
    search?: string
    filter_status?: string
    filter_kategori_proposal_id?: number
    sort?: string
    order?: 'asc' | 'desc'
  }) => {
    const queryParams = new URLSearchParams()

    if (params?.page !== undefined) queryParams.append('page', params.page.toString())
    if (params?.per_page !== undefined) queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.filter_status) queryParams.append('filter_status', params.filter_status)
    if (params?.filter_kategori_proposal_id !== undefined) queryParams.append('filter_kategori_proposal_id', params.filter_kategori_proposal_id.toString())
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.order) queryParams.append('order', params.order)

    const queryString = queryParams.toString()
    const endpoint = `/pengajuan-proposal${queryString ? `?${queryString}` : ''}`

    return get(endpoint)
  }

  const getDetailPengajuanProposal = async (id: number) => {
    return get(`/pengajuan-proposal/${id}`)
  }

  const createPengajuanProposal = async (data: {
    kategori_proposal_id: number
    nomor_telepon_pengaju?: string
    nama_kegiatan: string
    deskripsi_kegiatan: string
    usulan_anggaran: number
    file_pendukung?: File[]
    latitude: number
    longitude: number
    nama_lokasi: string
    alamat: string
    thumbnail_foto_banner?: File
    tanda_tangan_digital?: string
  }) => {
    const formData = new FormData()

    formData.append('kategori_proposal_id', data.kategori_proposal_id.toString())
    if (data.nomor_telepon_pengaju) formData.append('nomor_telepon_pengaju', data.nomor_telepon_pengaju)
    formData.append('nama_kegiatan', data.nama_kegiatan)
    formData.append('deskripsi_kegiatan', data.deskripsi_kegiatan)
    formData.append('usulan_anggaran', data.usulan_anggaran.toString())
    formData.append('latitude', data.latitude.toString())
    formData.append('longitude', data.longitude.toString())
    formData.append('nama_lokasi', data.nama_lokasi)
    formData.append('alamat', data.alamat)

    if (data.file_pendukung && data.file_pendukung.length > 0) {
      data.file_pendukung.forEach((file) => {
        formData.append('file_pendukung[]', file)
      })
    }

    if (data.thumbnail_foto_banner) {
      formData.append('thumbnail_foto_banner', data.thumbnail_foto_banner)
    }

    if (data.tanda_tangan_digital) {
      formData.append('tanda_tangan_digital', data.tanda_tangan_digital)
    }

    const config = useRuntimeConfig()
    const isDevelopment = import.meta.dev
    const apiBaseUrl = isDevelopment 
      ? config.public.apiBaseUrl
      : config.public.apiDomain
    
    const token = import.meta.client ? (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) : null
    
    const response = await fetch(`${apiBaseUrl}/api/pwa/pengajuan-proposal`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    })

    const result = await response.json()
    
    if (!response.ok) {
      const error = new Error(result.message || `HTTP error! status: ${response.status}`)
      ;(error as any).response = result
      ;(error as any).status = response.status
      throw error
    }
    
    return result
  }

  const updatePengajuanProposal = async (id: number, data: {
    kategori_proposal_id?: number
    nomor_telepon_pengaju?: string
    nama_kegiatan?: string
    deskripsi_kegiatan?: string
    usulan_anggaran?: number
    deleted_files?: string[]
    file_pendukung?: File[]
    latitude?: number
    longitude?: number
    nama_lokasi?: string
    alamat?: string
    thumbnail_foto_banner?: File
    tanda_tangan_digital?: string
  }) => {
    const formData = new FormData()

    if (data.kategori_proposal_id !== undefined) formData.append('kategori_proposal_id', data.kategori_proposal_id.toString())
    if (data.nomor_telepon_pengaju !== undefined && data.nomor_telepon_pengaju !== null) formData.append('nomor_telepon_pengaju', data.nomor_telepon_pengaju)
    if (data.nama_kegiatan !== undefined && data.nama_kegiatan !== null) formData.append('nama_kegiatan', data.nama_kegiatan)
    if (data.deskripsi_kegiatan !== undefined && data.deskripsi_kegiatan !== null) formData.append('deskripsi_kegiatan', data.deskripsi_kegiatan)
    if (data.usulan_anggaran !== undefined && data.usulan_anggaran !== null) formData.append('usulan_anggaran', data.usulan_anggaran.toString())
    if (data.latitude !== undefined && data.latitude !== null) formData.append('latitude', data.latitude.toString())
    if (data.longitude !== undefined && data.longitude !== null) formData.append('longitude', data.longitude.toString())
    if (data.nama_lokasi !== undefined && data.nama_lokasi !== null) formData.append('nama_lokasi', data.nama_lokasi)
    if (data.alamat !== undefined && data.alamat !== null) formData.append('alamat', data.alamat)

    if (data.deleted_files && data.deleted_files.length > 0) {
      data.deleted_files.forEach((filePath) => {
        formData.append('deleted_files[]', filePath)
      })
    }

    if (data.file_pendukung && data.file_pendukung.length > 0) {
      data.file_pendukung.forEach((file) => {
        formData.append('file_pendukung[]', file)
      })
    }

    if (data.thumbnail_foto_banner) {
      formData.append('thumbnail_foto_banner', data.thumbnail_foto_banner)
    }

    if (data.tanda_tangan_digital) {
      formData.append('tanda_tangan_digital', data.tanda_tangan_digital)
    }

    const config = useRuntimeConfig()
    const isDevelopment = import.meta.dev
    const apiBaseUrl = isDevelopment 
      ? config.public.apiBaseUrl
      : config.public.apiDomain
    
    const token = import.meta.client ? (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) : null
    
    const response = await fetch(`${apiBaseUrl}/api/pwa/pengajuan-proposal/${id}/update`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    })

    const result = await response.json()
    
    if (!response.ok) {
      const error = new Error(result.message || `HTTP error! status: ${response.status}`)
      ;(error as any).response = result
      ;(error as any).status = response.status
      throw error
    }
    
    return result
  }

  const deletePengajuanProposal = async (id: number) => {
    return del(`/pengajuan-proposal/${id}`)
  }

  const exportPDF = async (id: number) => {
    const config = useRuntimeConfig()
    const isDevelopment = import.meta.dev
    const apiBaseUrl = isDevelopment 
      ? config.public.apiBaseUrl
      : config.public.apiDomain
    
    const token = import.meta.client ? (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) : null
    
    const response = await fetch(`${apiBaseUrl}/api/pwa/pengajuan-proposal/${id}/export-pdf`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Gagal mengunduh PDF' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.blob()
  }

  return {
    getKategoriProposal,
    getListPengajuanProposal,
    getDetailPengajuanProposal,
    createPengajuanProposal,
    updatePengajuanProposal,
    deletePengajuanProposal,
    exportPDF
  }
}

