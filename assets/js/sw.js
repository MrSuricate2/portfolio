// Incrémente cette version à chaque mise à jour du site
const CACHE_VERSION = 'portfolio-v1.0.1';
const CACHE_FILES = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/script.js',
  '/assets/images/favicon/favicon-96x96.png'
];

// Installation : mise en cache des ressources
self.addEventListener('install', (event) => {
  console.log('[SW] Installation du Service Worker version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      console.log('[SW] Mise en cache des fichiers');
      return cache.addAll(CACHE_FILES);
    }).then(() => {
      // Force l'activation immédiate du nouveau SW
      console.log('[SW] skipWaiting');
      return self.skipWaiting();
    })
  );
});

// Activation : suppression des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation du Service Worker version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprime tous les caches qui ne correspondent pas à la version actuelle
          if (cacheName !== CACHE_VERSION) {
            console.log('[SW] Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Prend le contrôle de toutes les pages immédiatement
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch : stratégie de cache
self.addEventListener('fetch', (event) => {
  // Network only pour les requêtes API
  if (event.request.url.includes('send-email.php')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Stale-while-revalidate pour les assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((response) => {
        // Clone la réponse avant de la mettre en cache
        const responseToCache = response.clone();
        caches.open(CACHE_VERSION).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Si le réseau échoue, retourne la version en cache
        return cached;
      });
      
      // Retourne immédiatement la version en cache si disponible
      return cached || fetched;
    })
  );
});

// Message pour forcer la mise à jour du SW depuis la page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Message reçu: SKIP_WAITING');
    self.skipWaiting();
  }
});