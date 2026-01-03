export const useEmergencyLocation = () => {
  const { get } = useApi()

  const getKategoriLayananDarurat = async () => {
    return get('/layanan-darurat/kategori')
  }

  const getListLayananDarurat = async (params?: {
    page?: number
    per_page?: number
    search?: string
    kategori?: string
    sort?: string
    order?: 'asc' | 'desc'
  }) => {
    const queryParams = new URLSearchParams()
    
    if (params?.page !== undefined) queryParams.append('page', params.page.toString())
    if (params?.per_page !== undefined) queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.kategori) queryParams.append('kategori', params.kategori)
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.order) queryParams.append('order', params.order)

    const queryString = queryParams.toString()
    const endpoint = `/layanan-darurat${queryString ? `?${queryString}` : ''}`
    
    return get(endpoint)
  }

  return {
    getKategoriLayananDarurat,
    getListLayananDarurat
  }
}

