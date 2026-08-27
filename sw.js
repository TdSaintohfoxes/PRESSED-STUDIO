const CACHE = 'pressed-v15';
const BASE = self.registration.scope;
const ASSETS = [BASE, BASE+'index.html', BASE+'manifest.webmanifest', BASE+'icon-192.png', BASE+'icon-512.png', BASE+'favicon-32.png', BASE+'apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const copy = res.clone();
      if (res.ok && (e.request.url.startsWith(self.location.origin))) {
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(BASE+'index.html')))
  );
});
