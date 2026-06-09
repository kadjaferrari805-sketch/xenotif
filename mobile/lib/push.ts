import { Platform } from 'react-native'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import { supabase } from './supabase'

// Affiche les notifications reçues quand l'app est au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

function getProjectId(): string | undefined {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants as { easConfig?: { projectId?: string } }).easConfig?.projectId
  )
}

/**
 * Demande la permission, récupère le ExpoPushToken et l'enregistre dans Supabase.
 * À appeler quand un utilisateur est connecté. Idempotent (upsert sur le token).
 * Renvoie le token, ou null si indisponible (permission refusée, émulateur, projectId manquant).
 */
export async function registerForPushNotificationsAsync(userId: string): Promise<string | null> {
  // Canal Android requis pour afficher les notifications
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Notifications',
      importance: Notifications.AndroidImportance.DEFAULT,
    })
  }

  const { status: existing } = await Notifications.getPermissionsAsync()
  let status = existing
  if (status !== 'granted') {
    status = (await Notifications.requestPermissionsAsync()).status
  }
  if (status !== 'granted') return null

  const projectId = getProjectId()
  if (!projectId) {
    console.warn('[push] projectId EAS introuvable dans app.json (extra.eas.projectId)')
    return null
  }

  let token: string
  try {
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data
  } catch (err) {
    // émulateur/simulateur ou appareil sans services push
    console.warn('[push] impossible de récupérer le token', err)
    return null
  }

  const { error } = await supabase
    .from('push_tokens')
    .upsert(
      { user_id: userId, token, platform: Platform.OS === 'ios' ? 'ios' : 'android' },
      { onConflict: 'token' }
    )
  if (error) console.warn('[push] échec enregistrement du token', error.message)

  return token
}
