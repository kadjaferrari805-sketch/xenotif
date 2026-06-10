import { Tabs } from 'expo-router'
import { View, StyleSheet, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'

function TabIcon({ name, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons name={name} size={22} color={focused ? COLORS.orange : COLORS.gray} />
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
        tabBarActiveTintColor: COLORS.orange,
        tabBarInactiveTintColor: COLORS.gray,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'grid' : 'grid-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="disciplines"
        options={{
          title: 'Disciplines',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'fitness' : 'fitness-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="programme"
        options={{
          title: 'Programme',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'barbell' : 'barbell-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="smartwatch"
        options={{
          title: 'Montre',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'watch' : 'watch-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.card,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: `${COLORS.orange}15`,
  },
})
