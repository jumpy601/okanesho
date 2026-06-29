// Service Worker - 只負責安裝，不攔截任何請求
var CACHE_NAME = 'okanesho-v5';

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // 清除所有舊 cache
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// 不攔截任何 fetch，全部直接走網路
