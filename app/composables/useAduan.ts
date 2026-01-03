export const useAduan = () => {
  const { get, post, put, delete: del } = useApi()

  const getListAduan = async (params?: {
    page?: number
    per_page?: number
    search?: string
    status?: string
    jenis_aduan?: string
    sort?: string
    order?: 'asc' | 'desc'
  }) => {
    const queryParams = new URLSearchParams()
    
    if (params?.page !== undefined) queryParams.append('page', params.page.toString())
    if (params?.per_page !== undefined) queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.jenis_aduan) queryParams.append('jenis_aduan', params.jenis_aduan)
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.order) queryParams.append('order', params.order)

    const queryString = queryParams.toString()
    const endpoint = `/aduan-masyarakat${queryString ? `?${queryString}` : ''}`
    
    return get(endpoint)
  }

  const getDetailAduan = async (id: number, params?: Record<string, any>) => {
    let endpoint = `/aduan-masyarakat/${id}`
    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString()
      endpoint += `?${queryString}`
    }
    return get(endpoint)
  }

  const createAduan = async (data: {
    kategori_aduan_id: number
    judul: string
    detail_aduan: string
    latitude: number
    longitude: number
    nama_lokasi: string
    deskripsi_lokasi: string
    jenis_aduan: string
    alasan_melaporkan?: string
    files?: File[]
  }) => {
    const formData = new FormData()
    
    formData.append('kategori_aduan_id', data.kategori_aduan_id.toString())
    formData.append('judul', data.judul)
    formData.append('detail_aduan', data.detail_aduan)
    formData.append('latitude', data.latitude.toString())
    formData.append('longitude', data.longitude.toString())
    formData.append('nama_lokasi', data.nama_lokasi)
    formData.append('deskripsi_lokasi', data.deskripsi_lokasi)
    formData.append('jenis_aduan', data.jenis_aduan)
    if (data.alasan_melaporkan) {
      formData.append('alasan_melaporkan', data.alasan_melaporkan)
    }
    
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append('files[]', file)
      })
    }

    const config = useRuntimeConfig()
    const isDevelopment = import.meta.dev
    const apiBaseUrl = isDevelopment 
      ? config.public.apiBaseUrl
      : config.public.apiDomain
    
    const token = import.meta.client ? (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) : null
    
    const response = await fetch(`${apiBaseUrl}/api/pwa/aduan-masyarakat`, {
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

  const updateAduan = async (id: number, data: {
    kategori_aduan_id?: number
    judul?: string
    detail_aduan?: string
    latitude?: number
    longitude?: number
    nama_lokasi?: string
    deskripsi_lokasi?: string
    jenis_aduan?: string
    alasan_melaporkan?: string
    deleted_files?: number[]
    files?: File[]
  }) => {
    // Cek apakah ada files atau deleted_files
    const hasFiles = data.files && data.files.length > 0
    const hasDeletedFiles = data.deleted_files && data.deleted_files.length > 0
    
    // Jika ada files atau deleted_files, gunakan POST ke endpoint khusus
    if (hasFiles || hasDeletedFiles) {
      const formData = new FormData()
      
      if (data.kategori_aduan_id !== undefined) formData.append('kategori_aduan_id', data.kategori_aduan_id.toString())
      if (data.judul) formData.append('judul', data.judul)
      if (data.detail_aduan) formData.append('detail_aduan', data.detail_aduan)
      if (data.latitude !== undefined) formData.append('latitude', data.latitude.toString())
      if (data.longitude !== undefined) formData.append('longitude', data.longitude.toString())
      if (data.nama_lokasi) formData.append('nama_lokasi', data.nama_lokasi)
      if (data.deskripsi_lokasi) formData.append('deskripsi_lokasi', data.deskripsi_lokasi)
      if (data.jenis_aduan) formData.append('jenis_aduan', data.jenis_aduan)
      if (data.alasan_melaporkan) formData.append('alasan_melaporkan', data.alasan_melaporkan)
      
      if (data.deleted_files && data.deleted_files.length > 0) {
        data.deleted_files.forEach((fileId) => {
          const id = typeof fileId === 'number' ? fileId : parseInt(fileId)
          formData.append('deleted_files[]', id.toString())
        })
      }
      
      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append('files[]', file)
        })
      }

      const config = useRuntimeConfig()
      const isDevelopment = import.meta.dev
      const apiBaseUrl = isDevelopment 
        ? config.public.apiBaseUrl
        : config.public.apiDomain
      
      const token = import.meta.client ? (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) : null
      
      const response = await fetch(`${apiBaseUrl}/api/pwa/aduan-masyarakat/${id}/update`, {
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
    } else {
      return put(`/aduan-masyarakat/${id}`, data)
    }
  }

  const deleteAduan = async (id: number) => {
    return del(`/aduan-masyarakat/${id}`)
  }

  const getKategoriAduan = async () => {
    return get('/aduan-masyarakat/kategori')
  }

  return {
    getListAduan,
    getDetailAduan,
    createAduan,
    updateAduan,
    deleteAduan,
    getKategoriAduan
  }
}

