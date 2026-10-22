// PM staff push notifications – keep this file in the same folder as staff.html
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});

self.addEventListener('push', event => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { body: event.data ? event.data.text() : '' }; }
  event.waitUntil(self.registration.showNotification(d.title || 'PM Staff', {
    body: d.body || '',
    icon: 'staff-icon-192.png',
    badge: 'staff-icon-192.png',
    tag: d.tag || 'pm-order',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: d.url || self.registration.scope }
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || self.registration.scope;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if (c.url.split('#')[0] === url.split('#')[0] && 'focus' in c) return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
