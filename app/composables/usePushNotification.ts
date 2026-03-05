export const usePushNotification = () => {
  const { get, post } = useApi()
  const config = useRuntimeConfig()
  
  const isDevelopment = import.meta.dev
  const apiBaseUrl = isDevelopment 
    ? config.public.apiBaseUrl
    : config.public.apiDomain

  const isSupported = (): boolean => {
    if (typeof window === 'undefined') return false
    return 'Notification' in window && 
           'serviceWorker' in navigator && 
           'PushManager' in window
  }

  const checkPermission = (): NotificationPermission => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied'
    }
    return Notification.permission
  }

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported()) {
      throw new Error('Browser tidak mendukung Push Notification')
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  const getVapidPublicKey = async (): Promise<string> => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/pwa/push/vapid-key`)
      const data = await response.json()
      
      if (!data.success || !data.public_key) {
        throw new Error(data.message || 'Failed to get VAPID public key')
      }
      
      return data.public_key
    } catch (error) {
      console.error('Error getting VAPID key:', error)
      throw error
    }
  }

  const subscribeToPush = async (): Promise<boolean> => {
    if (!isSupported()) {
      throw new Error('Browser tidak mendukung Push Notification')
    }

    try {
      // 1. Get VAPID public key dari backend
      const vapidPublicKey = await getVapidPublicKey()
      
      // 2. Register service worker jika belum
      const registration = await navigator.serviceWorker.ready
      
      // 3. Convert VAPID key ke Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey)
      
      // 4. Subscribe ke push manager
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      })

      // 5. Convert keys ke base64 untuk dikirim ke backend
      const p256dh = btoa(
        String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))
      )
      const auth = btoa(
        String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))
      )

      // 6. Kirim subscription ke backend
      await post('/push/subscribe', {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: p256dh,
          auth: auth
        }
      })

      return true
    } catch (error: any) {
      console.error('Error subscribing to push:', error)
      throw error
    }
  }

  const unsubscribeFromPush = async (): Promise<boolean> => {
    if (!isSupported()) {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        // Unsubscribe dari browser
        await subscription.unsubscribe()

        // Hapus dari backend
        await post('/push/unsubscribe', {
          endpoint: subscription.endpoint
        })
      }

      return true
    } catch (error) {
      console.error('Error unsubscribing from push:', error)
      throw error
    }
  }

  const enableNotifications = async (): Promise<boolean> => {
    try {
      // 1. Request permission
      const granted = await requestPermission()
      
      if (!granted) {
        throw new Error('Permission denied')
      }

      // 2. Subscribe to push
      await subscribeToPush()
      
      return true
    } catch (error) {
      console.error('Error enabling notifications:', error)
      throw error
    }
  }

  const isSubscribed = async (): Promise<boolean> => {
    if (!isSupported()) {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      return subscription !== null
    } catch (error) {
      return false
    }
  }

  return {
    isSupported,
    checkPermission,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    enableNotifications,
    isSubscribed,
    getVapidPublicKey
  }
}
