// Service worker minimal — rend Xenotif installable en PWA (critère Chrome :
// un SW avec un gestionnaire `fetch`). Aucune mise en cache : on laisse le
// réseau gérer chaque requête → jamais de contenu obsolète (le site est SSG,
// mis à jour au déploiement).
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {
  // Pass-through : pas d'interception, le navigateur traite la requête normalement.
})

// ── Compteur du badge d'icône (PWA Badging API) ─────────────────────────
// Compteur persistant (IndexedDB) du nombre de notifications reçues non lues.
// Survit aux redémarrages du service worker → le « 41 » reste sur l'icône de
// l'app sur l'écran d'accueil mobile, même app fermée. mode : 'inc' (+delta,
// plancher 0), 'reset' (→0), 'get'.
function badgeCount(mode, delta) {
  return new Promise((resolve) => {
    let req
    try { req = indexedDB.open('xeno-badge', 1) } catch (e) { resolve(0); return }
    req.onupgradeneeded = () => req.result.createObjectStore('kv')
    req.onerror = () => resolve(0)
    req.onsuccess = () => {
      try {
        const tx = req.result.transaction('kv', 'readwrite')
        const store = tx.objectStore('kv')
        const get = store.get('count')
        get.onsuccess = () => {
          const cur = get.result || 0
          let next = cur
          if (mode === 'inc') next = Math.max(0, cur + (delta || 1))
          else if (mode === 'reset') next = 0
          if (mode !== 'get') store.put(next, 'count')
          resolve(next)
        }
        get.onerror = () => resolve(0)
      } catch (e) { resolve(0) }
    }
  })
}

async function applyBadge(n) {
  try {
    if (!('setAppBadge' in self.navigator)) return
    if (n > 0) await self.navigator.setAppBadge(n)
    else await self.navigator.clearAppBadge()
  } catch (e) { /* best-effort iOS 16.4+/Android */ }
}

// ── Web Push : affichage des notifications reçues + incrément du badge ───
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
  event.waitUntil((async () => {
    await self.registration.showNotification(title, options)
    // +1 sur le compteur → s'affiche sur l'icône de l'app (mobile).
    const n = await badgeCount('inc', 1)
    await applyBadge(n)
  })())
})

// ── Lecture in-app (clic cloche) → remet le compteur à zéro ─────────────
self.addEventListener('message', (event) => {
  if (event.data === 'xeno-clear-badge') {
    event.waitUntil((async () => {
      await badgeCount('reset')
      await applyBadge(0)
      try {
        const notifs = await self.registration.getNotifications()
        notifs.forEach((nf) => nf.close())
      } catch (e) { /* ignore */ }
    })())
  }
})

// ── Clic sur une notification → ouvre/focus la page concernée ───────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/dashboard'
  event.waitUntil((async () => {
    // Une notification lue → -1 sur le badge de l'icône.
    try { await applyBadge(await badgeCount('inc', -1)) } catch (e) { /* ignore */ }
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const w of wins) {
      if ('focus' in w) {
        if ('navigate' in w) { try { w.navigate(url) } catch { /* ignore */ } }
        return w.focus()
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(url)
  })())
})
