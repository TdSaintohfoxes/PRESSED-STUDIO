const CACHE='pressed-v19';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest']).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=e.request.url;
  e.respondWith(caches.open(CACHE).then(async cache=>{
    const cached=await cache.match(e.request);
    try{
      const res=await fetch(e.request);
      if(res&&res.ok&&url.startsWith(self.location.origin))cache.put(e.request,res.clone());
      return res;
    }catch(err){
      if(cached)return cached;
      if(e.request.mode==='navigate'){
        const shell=await cache.match('./index.html')||await cache.match('./');
        if(shell)return shell;
      }
      return Response.error();
    }
  }));
});
