export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, checkAuth } = useAuth()
  
  // Check authentication status
  if (process.client) {
    checkAuth()
  }
  
  // Halaman yang bisa diakses tanpa login
  const publicPages = ['/', '/auth', '/auth/login', '/auth/register', '/berita']
  const isPublicPage = publicPages.includes(to.path) || to.path.startsWith('/berita/')
  

  // Jika belum login dan bukan halaman publik, redirect ke auth
  if (!isAuthenticated.value && !isPublicPage) {
    return navigateTo('/auth')
  }
  
  // Jika sudah login dan mengakses halaman auth, redirect ke home
  if (isAuthenticated.value && isPublicPage && to.path.startsWith('/auth')) {
    return navigateTo('/')
  }
})

