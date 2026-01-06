import { useApi } from './useApi'

export const useBerita = () => {
  const { get } = useApi()

  const getTipeBerita = async () => {
    return get('/berita-pengumuman/tipe')
  }

  const getListBerita = async (params?: {
    page?: number
    per_page?: number
    search?: string
    tipe?: string
    sort?: string
    order?: 'asc' | 'desc'
  }) => {
    const queryParams = new URLSearchParams()

    if (params?.page !== undefined) queryParams.append('page', params.page.toString())
    if (params?.per_page !== undefined) queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.tipe) queryParams.append('tipe', params.tipe)
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.order) queryParams.append('order', params.order)

    const queryString = queryParams.toString()
    const endpoint = `/berita-pengumuman${queryString ? `?${queryString}` : ''}`

    return get(endpoint)
  }

  const getDetailBerita = async (id: number) => {
    return get(`/berita-pengumuman/${id}`)
  }

  return {
    getTipeBerita,
    getListBerita,
    getDetailBerita
  }
}


