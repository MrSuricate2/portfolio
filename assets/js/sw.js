self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('portfolio-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/css/style.css',
        '/assets/js/script.js',
        '/assets/images/favicon/favicon-96x96.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('send-email.php')) {
    // Network only pour les requêtes API
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Stale-while-revalidate pour les assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((response) => {
        const responseToCache = response.clone();
        caches.open('portfolio-v1').then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
      return cached || fetched;
    })
  );
});