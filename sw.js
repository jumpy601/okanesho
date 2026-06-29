var CACHE_NAME = 'okanesho-v4';
var urlsToCache = [
  '/okanesho/',
  '/okanesho/index.html',
  '/okanesho/icon-192.png',
  '/okanesho/icon-512.png'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var url = event.request.url;
  // 這些都直接 fetch，不走 cache
  if (url.indexOf('firebase') !== -1 ||
      url.indexOf('google') !== -1 ||
      url.indexOf('gstatic') !== -1 ||
      url.indexOf('googleapis') !== -1 ||
      url.indexOf('accounts.google') !== -1 ||
      url.indexOf('firestore') !== -1 ||
      url.indexOf('identitytoolkit') !== -1) {
    return; // 不攔截
  }
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request);
    })
  );
});
