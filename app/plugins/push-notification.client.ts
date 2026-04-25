export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  queueMicrotask(async () => {
    const pushNotification = usePushNotification()

    if (!pushNotification.isSupported()) {
      return
    }

    const token = localStorage.getItem('auth_token')
    if (!token) {
      return
    }

    try {
      if ('serviceWorker' in navigator) {
        await Promise.race([
          navigator.serviceWorker.ready,
          new Promise((resolve) => setTimeout(resolve, 4000))
        ])
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const permission = pushNotification.checkPermission()
      if (permission !== 'granted') {
        return
      }

      const subscribed = await pushNotification.isSubscribed()
      if (subscribed) {
        return
      }

      await pushNotification.subscribeToPush()
      console.log('Auto-subscribed to push notifications')
    } catch (error) {
      console.error('Auto-subscribe failed:', error)
    }
  })
})
