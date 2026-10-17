/* remind+ service worker: offline, cache, dan pengingat latar belakang */
const CACHE = 'remindplus-v2';
const FONTS = 'remindplus-fonts';
const SHELL = ['./', './index.html', './css/app.css', './js/config.js', './js/supa.js', './js/app.js', './manifest.webmanifest',
  './logo.svg', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './badge-96.png'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => ![CACHE, FONTS, 'pm-data'].includes(k)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Font Google: pakai cache, perbarui di belakang
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== self.location.origin) return; // API akun selalu langsung ke server
  // File aplikasi: utamakan jaringan agar selalu terbaru, jatuh ke cache saat offline
  e.respondWith(fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; })
    .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))));
});

/* Pemeriksaan pengingat di latar belakang (Chrome Android, aplikasi terpasang) */
async function checkReminders() {
  const c = await caches.open('pm-data');
  const r = await c.match('./reminders.json');
  if (!r) return;
  const d = await r.json(), now = Date.now(), N = d.notified || {};
  let changed = false;
  for (const x of d.list || []) {
    if (x.at <= now && now - x.at < 12 * 36e5 && !N[x.id]) {
      await self.registration.showNotification('⏰ ' + x.title, { body: x.body, tag: x.id, icon: 'icon-192.png', badge: 'badge-96.png', renotify: true, requireInteraction: true, vibrate: [800, 300, 800, 300, 800, 300, 800] });
      N[x.id] = now; changed = true;
    }
  }
  if (changed) await c.put('./reminders.json', new Response(JSON.stringify({ list: d.list, notified: N }), { headers: { 'Content-Type': 'application/json' } }));
}
self.addEventListener('periodicsync', e => { if (e.tag === 'pm-remind') e.waitUntil(checkReminders()); });
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    for (const w of ws) if ('focus' in w) return w.focus();
    return clients.openWindow('./');
  }));
});
