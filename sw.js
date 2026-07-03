// Khafaa Pro Service Worker v4.2
const CACHE = 'khafaa-v4-2026-07-02';
const CORE = [
  './',
  './index.html',
  './app.html',
  './dashboard.html',
  './manifest.json',
  './logo.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).catch(()=>{})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // never cache proxy fetches
  if(url.pathname.includes('/api/') || url.search.includes('url=')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp=>{
      if(resp.ok && e.request.method==='GET'){
        const clone = resp.clone();
        caches.open(CACHE).then(c=>c.put(e.request, clone));
      }
      return resp;
    }).catch(()=> caches.match('./index.html')))
  );
});

// Auto-wipe push
self.addEventListener('message', e => {
  if(e.data?.type === 'KHAFAA_WIPE'){
    caches.keys().then(keys=>keys.forEach(k=>caches.delete(k)));
  }
});
