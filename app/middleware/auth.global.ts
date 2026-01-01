export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, checkAuth } = useAuth()
  
  // Check authentication status
  if (process.client) {
    checkAuth()
  }
  
  const publicPages = ['/auth', '/auth/login', '/auth/register']
  const isPublicPage = publicPages.includes(to.path)
  

  if (!isAuthenticated.value && !isPublicPage) {
    return navigateTo('/auth')
  }
  
  if (isAuthenticated.value && isPublicPage) {
    return navigateTo('/')
  }
})

