export const usePwaInstall = () => {
  const isIOS = ref(false)
  const isStandalone = ref(false)
  const showInstallPrompt = ref(false)
  const deferredPrompt = ref<any>(null)

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

  const checkAndroidInstallPrompt = () => {
    if (typeof window === 'undefined') return
    if (isStandalone.value) return

    // Check if beforeinstallprompt event is available (Android Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e
      // Show prompt after a short delay
      setTimeout(() => {
        if (!isStandalone.value && shouldShowPrompt()) {
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
        if (!isStandalone.value) {
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
    if (isStandalone.value) return
    if (!shouldShowPrompt()) return
    
    // For Android, setup listener for beforeinstallprompt event
    checkAndroidInstallPrompt()
    
    // For iOS or fallback, show after delay
    setTimeout(() => {
      if (!isStandalone.value && shouldShowPrompt()) {
        // For iOS, always show instructions
        // For Android, show if we have deferred prompt or after timeout
        if (isIOS.value) {
          showInstallPrompt.value = true
        } else if (deferredPrompt.value) {
          // Android with prompt available
          showInstallPrompt.value = true
        } else {
          // Android fallback - show anyway after delay
          setTimeout(() => {
            if (!isStandalone.value && shouldShowPrompt()) {
              showInstallPrompt.value = true
            }
          }, 1000)
        }
      }
    }, 2000) // Show after 2 seconds
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    checkIOS()
  })

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
