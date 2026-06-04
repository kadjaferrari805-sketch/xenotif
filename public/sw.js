// Service worker minimal — rend Xenotif installable en PWA (critère Chrome :
// un SW avec un gestionnaire `fetch`). Aucune mise en cache : on laisse le
// réseau gérer chaque requête → jamais de contenu obsolète (le site est SSG,
// mis à jour au déploiement).
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {
  // Pass-through : pas d'interception, le navigateur traite la requête normalement.
})
