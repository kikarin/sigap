import { useApi } from './useApi'

export const useProgramBantuan = () => {
  const { get } = useApi()

  const getListRiwayatProgramBantuan = async (params?: {
    page?: number
    per_page?: number
    search?: string
    filter_status_penyaluran?: string
    filter_status_program?: string
    filter_tahun?: number
    sort?: string
    order?: 'asc' | 'desc'
  }) => {
    const queryParams = new URLSearchParams()

    if (params?.page !== undefined) queryParams.append('page', params.page.toString())
    if (params?.per_page !== undefined) queryParams.append('per_page', params.per_page.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.filter_status_penyaluran) queryParams.append('filter_status_penyaluran', params.filter_status_penyaluran)
    if (params?.filter_status_program) queryParams.append('filter_status_program', params.filter_status_program)
    if (params?.filter_tahun !== undefined) queryParams.append('filter_tahun', params.filter_tahun.toString())
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.order) queryParams.append('order', params.order)

    const queryString = queryParams.toString()
    const endpoint = `/program-bantuan/riwayat-saya${queryString ? `?${queryString}` : ''}`

    return get(endpoint)
  }

  const getDetailRiwayatProgramBantuan = async (id: number) => {
    return get(`/program-bantuan/riwayat-saya/${id}`)
  }

  return {
    getListRiwayatProgramBantuan,
    getDetailRiwayatProgramBantuan
  }
}

