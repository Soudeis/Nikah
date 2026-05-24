self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  const title = data.title || 'NikahConnect';
  const options = {
    body:  data.body  || 'Nouveau message',
    icon:  data.icon  || '/icon.png',
    badge: data.badge || '/icon.png',
    data:  data.url   || '/',
    vibrate: [200, 100, 200],
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});