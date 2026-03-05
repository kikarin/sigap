export default defineNuxtPlugin(async () => {
  if (typeof window === 'undefined') return

  const pushNotification = usePushNotification()
  
  // Cek apakah browser support
  if (!pushNotification.isSupported()) {
    return
  }

  // Tunggu service worker ready
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.ready
    } catch (error) {
      console.error('Service worker not ready:', error)
      return
    }
  }

  // Cek apakah user sudah login
  const token = localStorage.getItem('auth_token')
  if (!token) {
    return
  }

  // Delay sedikit untuk memastikan service worker sudah ready
  setTimeout(async () => {
    try {
      // Cek permission
      const permission = pushNotification.checkPermission()
      if (permission !== 'granted') {
        return
      }

      // Cek apakah sudah subscribe
      const subscribed = await pushNotification.isSubscribed()
      if (subscribed) {
        return
      }

      // Auto-subscribe jika permission granted tapi belum subscribe
      await pushNotification.subscribeToPush()
      console.log('Auto-subscribed to push notifications')
    } catch (error) {
      console.error('Auto-subscribe failed:', error)
      // Silent fail - user bisa subscribe manual nanti
    }
  }, 2000) // Delay 2 detik untuk memastikan semua sudah ready
})
