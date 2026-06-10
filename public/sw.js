// Service worker minimal — rend Xenotif installable en PWA (critère Chrome :
// un SW avec un gestionnaire `fetch`). Aucune mise en cache : on laisse le
// réseau gérer chaque requête → jamais de contenu obsolète (le site est SSG,
// mis à jour au déploiement).
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {
  // Pass-through : pas d'interception, le navigateur traite la requête normalement.
})

// ── Web Push : affichage des notifications reçues ───────────────────────
self.addEventListener('push', (event) => {
  let payload = {}
  try { payload = event.data ? event.data.json() : {} }
  catch { payload = { body: event.data ? event.data.text() : '' } }

  const title = payload.title || 'Xenotif'
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/apple-icon.png',
    badge: payload.badge || '/apple-icon.png',
    tag: payload.tag || 'xenotif',
    data: { url: payload.url || '/dashboard' },
    vibrate: [80, 40, 80],
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

// ── Clic sur une notification → ouvre/focus la page concernée ───────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/dashboard'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if ('focus' in w) {
          if ('navigate' in w) { try { w.navigate(url) } catch { /* ignore */ } }
          return w.focus()
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url)
    })
  )
})
