'use client'

// Helpers Web Push côté navigateur : permission, souscription PushManager,
// synchronisation avec le serveur (/api/push/web/*).

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

export function webPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window &&
    !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  )
}

export async function getWebPushSubscription(): Promise<PushSubscription | null> {
  if (!webPushSupported()) return null
  try {
    const reg = await navigator.serviceWorker.ready
    return await reg.pushManager.getSubscription()
  } catch {
    return null
  }
}

export type SubscribeResult = 'subscribed' | 'denied' | 'unsupported' | 'error'

export async function subscribeWebPush(): Promise<SubscribeResult> {
  if (!webPushSupported()) return 'unsupported'
  const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!vapid) return 'unsupported'

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return 'denied'

  try {
    const reg = await navigator.serviceWorker.ready
    let sub = await reg.pushManager.getSubscription()
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid) as BufferSource,
      })
    }
    const res = await fetch('/api/push/web/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub),
    })
    return res.ok ? 'subscribed' : 'error'
  } catch {
    return 'error'
  }
}

export async function unsubscribeWebPush(): Promise<boolean> {
  try {
    const sub = await getWebPushSubscription()
    if (!sub) return true
    await fetch('/api/push/web/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: sub.endpoint }),
    })
    await sub.unsubscribe()
    return true
  } catch {
    return false
  }
}
