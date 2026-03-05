// Handle push notification
self.addEventListener('push', function(event) {
  let data = {}
  
  if (event.data) {
    try {
      data = event.data.json()
    } catch (e) {
      data = {
        title: 'SIGAP',
        body: event.data.text() || 'Anda memiliki notifikasi baru'
      }
    }
  }
  
  const options = {
    body: data.body || 'Anda memiliki notifikasi baru',
    icon: data.icon || '/sigap.icon.png',
    badge: data.badge || '/sigap.icon.png',
    vibrate: data.vibrate || [200, 100, 200],
    tag: data.tag || 'sigap-notification',
    data: {
      url: data.url || data.data?.url || '/'
    },
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'SIGAP', options)
  )
})

// Handle klik notifikasi
self.addEventListener('notificationclick', function(event) {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      // Cari window yang sudah terbuka dengan URL yang sama
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      
      // Jika tidak ada, buka window baru
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})
