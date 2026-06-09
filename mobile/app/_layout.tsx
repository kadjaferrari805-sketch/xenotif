import '../global.css'
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useAuth } from '@/hooks/useAuth'
import { registerForPushNotificationsAsync } from '@/lib/push'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const { user } = useAuth()

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  // Enregistre le token push Expo dès qu'un utilisateur est connecté
  useEffect(() => {
    if (user) void registerForPushNotificationsAsync(user.id)
  }, [user])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0A0B0F" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0B0F' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="discipline/[slug]"
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
