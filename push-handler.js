/* Notificaciones push para el profe (se carga dentro del service worker de la app). */
self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = { data: { title: 'Jump Voley', body: event.data ? event.data.text() : '' } };
  }
  // Firebase Cloud Messaging envía los campos dentro de "data"
  const d = payload.data || payload.notification || payload;
  const title = d.title || 'Jump Voley';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: d.body || '',
      icon: new URL('pwa-192.png', self.registration.scope).href,
      badge: new URL('pwa-192.png', self.registration.scope).href,
      tag: d.tag || undefined,
      renotify: !!d.tag,
      vibrate: [200, 100, 200],
      data: { link: d.link || 'inicio' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.link) || 'inicio';
  const url = new URL('./#' + link, self.registration.scope).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) {
          if ('navigate' in c) c.navigate(url);
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
