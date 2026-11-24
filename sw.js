/* Coach Bowling : service worker minimal. Réseau d'abord (toujours la dernière version),
   copie locale en secours quand il n'y a pas de réseau (au bowling, par exemple). */
const C='coach-bowling-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;
  e.respondWith(
    fetch(r).then(res=>{
      if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{});}
      return res;
    }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html')||caches.match('./')))
  );
});
