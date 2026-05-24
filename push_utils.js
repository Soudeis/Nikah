const VAPID_PUBLIC_KEY = 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEzH7kqJt+nJ6VfsnS6HOmqSUbD2faBpLumab1RGB3SWLTAPaD1sagCJPb6Ixjsmv7G6o1q6aynXFd8skM5AfAyg==';

async function registerPush(userId) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  // Enregistrer le service worker
  const reg = await navigator.serviceWorker.register('/sw.js');

  // Demander permission
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return;

  // S'abonner aux push
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });

  // Envoyer l'abonnement au backend
  await fetch(`${API}/push/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, subscription: sub })
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw     = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}