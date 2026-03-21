// Custom service worker for Web Push notifications
// This gets imported by the VitePWA generated service worker

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'AfroHub', body: event.data.text() };
  }

  const options = {
    body: data.body || '',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: data.tag || 'afrohub-notification',
    renotify: true,
    data: data.data || {},
    actions: data.actions || [],
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'AfroHub', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlPath = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({ type: 'NOTIFICATION_CLICK', data: event.notification.data });
          return;
        }
      }
      return self.clients.openWindow(urlPath);
    })
  );
});
