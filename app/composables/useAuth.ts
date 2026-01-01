export const useAuth = () => {
  const isAuthenticated = useState<boolean>('auth', () => false)
  const user = useState<any>('user', () => null)
  const token = useState<string | null>('token', () => null)

  const login = (userData: any, authToken: string) => {
    isAuthenticated.value = true
    user.value = userData
    token.value = authToken
    // Simpan ke localStorage untuk persist
    if (process.client) {
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('auth_token', authToken)
    }
  }

  const logout = async () => {
    const { post } = useApi()
    
    try {
      // Call logout API jika ada token
      if (token.value) {
        await post('/logout')
      }
    } catch (error) {
      // Ignore error, tetap logout dari client
      console.error('Logout error:', error)
    } finally {
      isAuthenticated.value = false
      user.value = null
      token.value = null
      // Hapus dari localStorage
      if (process.client) {
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('user')
        localStorage.removeItem('auth_token')
      }
    }
  }

  const checkAuth = async () => {
    if (process.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
        
        // Verify token dengan API
        try {
          const { get } = useApi()
          const response = await get('/me')
          if (response.success && response.data?.user) {
            user.value = response.data.user
            isAuthenticated.value = true
            localStorage.setItem('user', JSON.stringify(response.data.user))
          }
        } catch (error) {
          // Token invalid, logout
          logout()
        }
      }
    }
  }

  // Check auth saat composable di-load
  if (process.client) {
    checkAuth()
  }

  return {
    isAuthenticated: readonly(isAuthenticated),
    user: readonly(user),
    token: readonly(token),
    login,
    logout,
    checkAuth
  }
}

