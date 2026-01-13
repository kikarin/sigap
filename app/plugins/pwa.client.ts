export default defineNuxtPlugin(() => {
  if (process.client && typeof window !== 'undefined') {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const deferredPrompt = e
      ;(window as any).__deferredPrompt = deferredPrompt
      window.dispatchEvent(new CustomEvent('pwa-install-available', { detail: e }))
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }
})
