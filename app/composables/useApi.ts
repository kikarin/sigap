export const useApi = () => {
  const config = useRuntimeConfig()
  
  const isDevelopment = import.meta.dev
  
  const apiBaseUrl = isDevelopment 
    ? config.public.apiBaseUrl  // http://localhost:8000
    : config.public.apiDomain    // https://sigap.summitct.co.id
  
  const getApiUrl = (endpoint: string): string => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    return `${apiBaseUrl}/api/pwa/${cleanEndpoint}`
  }
  
  const apiFetch = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const url = getApiUrl(endpoint)
    
    const token = import.meta.client ? (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null) : null
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })
    
    const data = await response.json().catch(() => ({ message: 'An error occurred' }))
    
    if (!response.ok) {
      const errorMessage = data.message || `HTTP error! status: ${response.status}`
      const error = new Error(errorMessage)
      ;(error as any).response = data
      ;(error as any).status = response.status
      throw error
    }
    
    return data
  }
  
  const get = <T = any>(endpoint: string, options?: RequestInit): Promise<T> => {
    return apiFetch<T>(endpoint, { ...options, method: 'GET' })
  }
  
  const post = <T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    return apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
  
  const put = <T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    return apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
  
  const patch = <T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    return apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
  
  const del = <T = any>(endpoint: string, options?: RequestInit): Promise<T> => {
    return apiFetch<T>(endpoint, { ...options, method: 'DELETE' })
  }
  
  return {
    apiBaseUrl,
    getApiUrl,
    apiFetch,
    get,
    post,
    put,
    patch,
    delete: del,
  }
}

