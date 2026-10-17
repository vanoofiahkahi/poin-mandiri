const CACHE='poin-mandiri-v3';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!=='pm-data').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||!e.request.url.startsWith(self.location.origin))return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
// Pemeriksaan pengingat di latar belakang (Chrome Android, aplikasi terpasang)
async function checkReminders(){
  const c=await caches.open('pm-data');const r=await c.match('./reminders.json');if(!r)return;
  const d=await r.json(),now=Date.now(),N=d.notified||{};let changed=false;
  for(const x of d.list||[]){
    if(x.at<=now&&now-x.at<12*36e5&&!N[x.id]){
      await self.registration.showNotification('⏰ '+x.title,{body:x.body,tag:x.id,icon:'icon-192.png',badge:'icon-192.png',renotify:true,requireInteraction:true,vibrate:[800,300,800,300,800,300,800]});
      N[x.id]=now;changed=true;
    }
  }
  if(changed)await c.put('./reminders.json',new Response(JSON.stringify({list:d.list,notified:N}),{headers:{'Content-Type':'application/json'}}));
}
self.addEventListener('periodicsync',e=>{if(e.tag==='pm-remind')e.waitUntil(checkReminders())});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{for(const w of ws){if('focus' in w)return w.focus()}return clients.openWindow('./')}));
});
