const CACHE_NAME = 'after-client-shell-v3';

const ARQUIVOS_PARA_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest'
  './favicon.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(ARQUIVOS_PARA_CACHE);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(chaves) {
        return Promise.all(
          chaves.map(function(chave) {
            if (chave !== CACHE_NAME) {
              return caches.delete(chave);
            }
          })
        );
      })
      .then(function() {
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(respostaCache) {
        return respostaCache || fetch(event.request);
      })
  );
});
