import { Redirect } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { View, ActivityIndicator } from 'react-native'
import { COLORS } from '@/constants/theme'

export default function Index() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.orange} size="large" />
      </View>
    )
  }

  if (!session) return <Redirect href="/onboarding" />
  return <Redirect href="/(tabs)" />
}
