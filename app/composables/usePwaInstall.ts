export const usePwaInstall = () => {
  const isIOS = useState<boolean>('pwa-is-ios', () => false)
  const isStandalone = useState<boolean>('pwa-is-standalone', () => false)
  const showInstallPrompt = useState<boolean>('pwa-show-install-prompt', () => false)
  const deferredPrompt = useState<any>('pwa-deferred-prompt', () => null)

  const isDesktop = useState<boolean>('pwa-is-desktop', () => false)

  const checkIOS = () => {
    if (typeof window === 'undefined') return
    
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIPad = /ipad/.test(userAgent)
    const isIPhone = /iphone/.test(userAgent)
    const isIOSDevice = isIPad || isIPhone
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone
    
    const isDesktopDevice = !isIOSDevice && 
      (userAgent.includes('windows') || 
       userAgent.includes('macintosh') || 
       userAgent.includes('linux') ||
       userAgent.includes('x11'))
    
    isIOS.value = isIOSDevice
    isDesktop.value = isDesktopDevice
    isStandalone.value = isInStandaloneMode || window.matchMedia('(display-mode: standalone)').matches
  }

  const shouldShowPrompt = () => {
    if (typeof window === 'undefined') return false
    if (isStandalone.value) return false
    
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

  const checkAndroidInstallPrompt = () => {
    if (typeof window === 'undefined') return
    if (isStandalone.value) return

    if ((window as any).__deferredPrompt) {
      deferredPrompt.value = (window as any).__deferredPrompt
      if (!isStandalone.value && shouldShowPrompt() && !showInstallPrompt.value) {
        showInstallPrompt.value = true
      }
    }

    const handlePwaInstallAvailable = (e: CustomEvent) => {
      deferredPrompt.value = e.detail
      if (!isStandalone.value && shouldShowPrompt() && !showInstallPrompt.value) {
        showInstallPrompt.value = true
      }
    }

    window.addEventListener('pwa-install-available', handlePwaInstallAvailable as EventListener)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e
      ;(window as any).__deferredPrompt = e
      
      if (!isStandalone.value && shouldShowPrompt()) {
        showInstallPrompt.value = true
      }
    }

    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
  }

  const checkIOSInstallPrompt = () => {
    if (typeof window === 'undefined') return
    if (isStandalone.value) return

    if (isIOS.value) {
      setTimeout(() => {
        if (!isStandalone.value && shouldShowPrompt()) {
          showInstallPrompt.value = true
        }
      }, 3000)
    }
  }

  const installPWA = async () => {
    if (typeof window === 'undefined') return false
    
    if (deferredPrompt.value) {
      try {
        await deferredPrompt.value.prompt()
        const { outcome } = await deferredPrompt.value.userChoice
        
        if (outcome === 'accepted') {
          showInstallPrompt.value = false
        }
        
        deferredPrompt.value = null
        return true
      } catch (error) {
        showInstallPrompt.value = false
        return false
      }
    } else if (isIOS.value) {
      showInstallPrompt.value = false
      return false
    } else {
      showInstallPrompt.value = false
      return false
    }
  }

  const dismissPrompt = () => {
    showInstallPrompt.value = false
    deferredPrompt.value = null
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    }
  }

  if (process.client && typeof window !== 'undefined') {
    checkIOS()
    
    nextTick(() => {
      if (!isStandalone.value) {
        checkAndroidInstallPrompt()
      }
    })
  }

  const triggerInstallPrompt = () => {
    if (typeof window === 'undefined') return
    
    checkIOS()
    
    if (isStandalone.value) {
      return
    }
    
    if (!shouldShowPrompt()) {
      return
    }
    
    checkAndroidInstallPrompt()
    
    if (isIOS.value) {
      checkIOSInstallPrompt()
      return
    }
    
    if (deferredPrompt.value) {
      showInstallPrompt.value = true
    } else {
      showInstallPrompt.value = true
      
      nextTick(() => {
        if (!isStandalone.value && shouldShowPrompt()) {
          showInstallPrompt.value = true
        }
      })
    }
  }

  return {
    isIOS,
    isDesktop,
    isStandalone,
    showInstallPrompt,
    deferredPrompt,
    installPWA,
    dismissPrompt,
    shouldShowPrompt,
    triggerInstallPrompt
  }
}
