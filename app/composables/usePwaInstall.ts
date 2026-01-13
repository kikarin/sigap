export const usePwaInstall = () => {
  const isIOS = useState<boolean>('pwa-is-ios', () => false)
  const isStandalone = useState<boolean>('pwa-is-standalone', () => false)
  const showInstallPrompt = useState<boolean>('pwa-show-install-prompt', () => false)
  const deferredPrompt = useState<any>('pwa-deferred-prompt', () => null)

  const checkIOS = () => {
    if (typeof window === 'undefined') return
    
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIPad = /ipad/.test(userAgent)
    const isIPhone = /iphone/.test(userAgent)
    const isIOSDevice = isIPad || isIPhone
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone
    
    isIOS.value = isIOSDevice
    isStandalone.value = isInStandaloneMode || window.matchMedia('(display-mode: standalone)').matches
  }

  // Initialize on client side - use onMounted to ensure it runs only on client
  if (process.client && typeof window !== 'undefined') {
    checkIOS()
  }

  const checkAndroidInstallPrompt = () => {
    if (typeof window === 'undefined') return
    if (isStandalone.value) return

    // Check if beforeinstallprompt event is available (Android Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e
      // Show prompt after a short delay if not already shown
      setTimeout(() => {
        if (!isStandalone.value && shouldShowPrompt() && !showInstallPrompt.value) {
          showInstallPrompt.value = true
        }
      }, 1500)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
  }

  const checkIOSInstallPrompt = () => {
    if (typeof window === 'undefined') return
    if (isStandalone.value) return

    // Show install prompt for iOS after a delay
    if (isIOS.value) {
      setTimeout(() => {
        if (!isStandalone.value && shouldShowPrompt()) {
          showInstallPrompt.value = true
        }
      }, 3000) // Show after 3 seconds
    }
  }

  const installPWA = async () => {
    if (typeof window === 'undefined') return false
    
    if (deferredPrompt.value) {
      // Android Chrome
      try {
        deferredPrompt.value.prompt()
        const { outcome } = await deferredPrompt.value.userChoice
        
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt')
        }
        
        deferredPrompt.value = null
        showInstallPrompt.value = false
        return true
      } catch (error) {
        console.error('Error installing PWA:', error)
        return false
      }
    } else if (isIOS.value) {
      // iOS - show instructions (already shown in dialog)
      return false
    }
    return false
  }

  const dismissPrompt = () => {
    showInstallPrompt.value = false
    deferredPrompt.value = null
    // Store dismissal in localStorage to avoid showing again for a while
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    }
  }

  const shouldShowPrompt = () => {
    if (typeof window === 'undefined') return false
    if (isStandalone.value) return false
    
    // Check if user dismissed recently (within 7 days)
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const sevenDays = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - dismissedTime < sevenDays) {
        return false
      }
    }
    
    return true
  }

  const triggerInstallPrompt = () => {
    if (typeof window === 'undefined') return
    
    // Check if already installed
    checkIOS()
    
    console.log('PWA Install Check:', {
      isStandalone: isStandalone.value,
      isIOS: isIOS.value,
      shouldShow: shouldShowPrompt(),
      dismissed: localStorage.getItem('pwa-install-dismissed')
    })
    
    if (isStandalone.value) {
      console.log('PWA already installed, skipping prompt')
      return
    }
    
    if (!shouldShowPrompt()) {
      console.log('PWA prompt dismissed recently, skipping')
      return
    }
    
    // For Android, setup listener for beforeinstallprompt event
    checkAndroidInstallPrompt()
    
    // For iOS, show instructions after delay
    if (isIOS.value) {
      console.log('iOS detected, showing install instructions')
      checkIOSInstallPrompt()
      return
    }
    
    // For Android, show immediately
    // This ensures dialog appears even if event doesn't fire
    console.log('Android detected, showing install prompt')
    
    // Set directly to true - force show dialog
    console.log('Force setting showInstallPrompt to true')
    showInstallPrompt.value = true
    console.log('showInstallPrompt value after set:', showInstallPrompt.value)
    
    // Also try with nextTick to ensure reactivity
    nextTick(() => {
      if (!isStandalone.value && shouldShowPrompt()) {
        showInstallPrompt.value = true
        console.log('showInstallPrompt set to true in nextTick:', showInstallPrompt.value)
      }
    })
  }

  return {
    isIOS,
    isStandalone,
    showInstallPrompt,
    installPWA,
    dismissPrompt,
    shouldShowPrompt,
    triggerInstallPrompt
  }
}
