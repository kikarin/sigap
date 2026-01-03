import { useApi } from './useApi'

export const useLetter = () => {
  const { get, post, del } = useApi()

  const getJenisSurat = async () => {
    return get('/pengajuan-surat/jenis-surat')
  }

  const getDetailJenisSurat = async (id: number) => {
    return get(`/pengajuan-surat/jenis-surat/${id}`)
  }

  const getListPengajuanSurat = async (params?: {
    page?: number
    per_page?: number
    search?: string
    filter_status?: string
    filter_jenis_surat_id?: number
    sort?: string
    order?: 'asc' | 'desc'
  }) => {
    const queryParams = new URLSearchParams()

    if (params?.page !== undefined) queryParams.append('page', params.page.toString())
    if (params?.per_page !== undefined) queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.filter_status) queryParams.append('filter_status', params.filter_status)
    if (params?.filter_jenis_surat_id !== undefined) queryParams.append('filter_jenis_surat_id', params.filter_jenis_surat_id.toString())
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.order) queryParams.append('order', params.order)

    const queryString = queryParams.toString()
    const endpoint = `/pengajuan-surat${queryString ? `?${queryString}` : ''}`

    return get(endpoint)
  }

  const getDetailPengajuanSurat = async (id: number) => {
    return get(`/pengajuan-surat/${id}`)
  }

  const createPengajuanSurat = async (data: {
    jenis_surat_id: number
    tanggal_surat: string
    atribut: Record<number, {
      nilai?: string
      lampiran_files?: File[]
    }>
  }) => {
    const formData = new FormData()

    formData.append('jenis_surat_id', data.jenis_surat_id.toString())
    formData.append('tanggal_surat', data.tanggal_surat)

    Object.keys(data.atribut).forEach((atributId) => {
      const id = parseInt(atributId)
      const atribut = data.atribut[id]

      if (atribut.nilai !== undefined && atribut.nilai !== null) {
        formData.append(`atribut[${id}][nilai]`, atribut.nilai)
      }

      if (atribut.lampiran_files && atribut.lampiran_files.length > 0) {
        atribut.lampiran_files.forEach((file) => {
          formData.append(`atribut[${id}][lampiran_files][]`, file)
        })
      }
    })

    return post('/pengajuan-surat', formData)
  }

  const updatePengajuanSurat = async (id: number, data: {
    tanggal_surat?: string
    atribut?: Record<number, {
      nilai?: string
      deleted_files?: string[]
      lampiran_files?: File[]
    }>
  }) => {
    const formData = new FormData()

    if (data.tanggal_surat) {
      formData.append('tanggal_surat', data.tanggal_surat)
    }

    if (data.atribut) {
      Object.keys(data.atribut).forEach((atributId) => {
        const id = parseInt(atributId)
        const atribut = data.atribut![id]

        if (atribut.nilai !== undefined && atribut.nilai !== null) {
          formData.append(`atribut[${id}][nilai]`, atribut.nilai)
        }

        if (atribut.deleted_files && atribut.deleted_files.length > 0) {
          atribut.deleted_files.forEach((filePath) => {
            formData.append(`atribut[${id}][deleted_files][]`, filePath)
          })
        }

        if (atribut.lampiran_files && atribut.lampiran_files.length > 0) {
          atribut.lampiran_files.forEach((file) => {
            formData.append(`atribut[${id}][lampiran_files][]`, file)
          })
        }
      })
    }

    return post(`/pengajuan-surat/${id}/update`, formData)
  }

  const deletePengajuanSurat = async (id: number) => {
    return del(`/pengajuan-surat/${id}`)
  }

  const exportPDF = async (id: number) => {
    const config = useRuntimeConfig()
    const isDevelopment = import.meta.dev
    const apiBaseUrl = isDevelopment 
      ? config.public.apiBaseUrl
      : config.public.apiDomain
    
    const token = import.meta.client ? (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) : null
    
    const response = await fetch(`${apiBaseUrl}/api/pwa/pengajuan-surat/${id}/export-pdf`, {
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
    getJenisSurat,
    getDetailJenisSurat,
    getListPengajuanSurat,
    getDetailPengajuanSurat,
    createPengajuanSurat,
    updatePengajuanSurat,
    deletePengajuanSurat,
    exportPDF
  }
}

