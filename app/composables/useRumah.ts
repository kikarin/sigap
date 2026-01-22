import { useApi } from './useApi'

export const useRumah = () => {
  const { get, post } = useApi()
  const config = useRuntimeConfig()

  const getRumahSaya = async () => {
    return get('/rumah-saya')
  }

  const validateNomorRumah = async (nomorRumah: string) => {
    return post('/rumah-saya/validate-nomor-rumah', {
      nomor_rumah: nomorRumah
    })
  }

  const updateRumahSaya = async (data: {
    nomor_rumah: string
    is_milik_anda: boolean
    pemilik_id?: number | null
    keterangan?: string
    latitude?: number | null
    longitude?: number | null
    fotos?: File[]
    deleted_fotos?: number[]
  }) => {
    const formData = new FormData()
    
    formData.append('nomor_rumah', data.nomor_rumah)
    formData.append('is_milik_anda', data.is_milik_anda ? '1' : '0')
    
    if (data.is_milik_anda && data.pemilik_id) {
      formData.append('pemilik_id', data.pemilik_id.toString())
    }
    
    if (data.keterangan) {
      formData.append('keterangan', data.keterangan)
    }
    
    if (data.latitude !== undefined && data.latitude !== null) {
      formData.append('latitude', data.latitude.toString())
    }
    
    if (data.longitude !== undefined && data.longitude !== null) {
      formData.append('longitude', data.longitude.toString())
    }
    
    if (data.fotos && data.fotos.length > 0) {
      data.fotos.forEach((foto) => {
        formData.append('fotos[]', foto)
      })
    }
    
    if (data.deleted_fotos && data.deleted_fotos.length > 0) {
      data.deleted_fotos.forEach((index) => {
        formData.append('deleted_fotos[]', index.toString())
      })
    }

    const isDevelopment = import.meta.dev
    const apiBaseUrl = isDevelopment 
      ? config.public.apiBaseUrl
      : config.public.apiDomain
    
    const token = import.meta.client ? (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) : null
    
    const response = await fetch(`${apiBaseUrl}/api/pwa/rumah-saya/update`, {
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

  return {
    getRumahSaya,
    validateNomorRumah,
    updateRumahSaya
  }
}
