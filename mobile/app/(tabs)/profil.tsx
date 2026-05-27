import { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { COLORS, SPACING, RADIUS } from '@/constants/theme'

const MENU_ITEMS = [
  { icon: 'trophy-outline', label: 'Mes badges', color: '#fbbf24' },
  { icon: 'stats-chart-outline', label: 'Statistiques', color: '#38bdf8' },
  { icon: 'watch-outline', label: 'Montre connectée', color: COLORS.orange, route: '/(tabs)/smartwatch' },
  { icon: 'notifications-outline', label: 'Notifications', color: '#a78bfa' },
  { icon: 'shield-checkmark-outline', label: 'Confidentialité', color: '#34d399' },
  { icon: 'help-circle-outline', label: 'Aide & Support', color: COLORS.gray },
]

const BADGES = [
  { emoji: '🔥', label: 'Première séance', earned: true },
  { emoji: '⚡', label: '7 jours consécutifs', earned: true },
  { emoji: '🏆', label: '30 séances', earned: false },
  { emoji: '💎', label: 'Niveau Élite', earned: false },
]

export default function ProfilScreen() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<{ full_name: string } | null>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const initials = (profile?.full_name ?? user?.email ?? 'A').slice(0, 2).toUpperCase()

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('profiles').select('full_name').eq('id', user.id).single(),
      supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    ]).then(([{ data: p }, { data: s }]) => {
      setProfile(p)
      setName(p?.full_name ?? '')
      setSubscription(s)
    })
  }, [user])

  async function saveName() {
    if (!user || !name.trim()) return
    setSaving(true)
    await supabase.from('profiles').update({ full_name: name.trim() }).eq('id', user.id)
    setProfile(prev => ({ ...prev!, full_name: name.trim() }))
    setSaving(false)
    setEditing(false)
  }

  async function handleSignOut() {
    Alert.alert('Déconnexion', 'Tu es sûr de vouloir te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnecter', style: 'destructive', onPress: async () => {
        await signOut()
        router.replace('/onboarding')
      }},
    ])
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Avatar header */}
        <LinearGradient
          colors={[`${COLORS.orange}20`, COLORS.dark]}
          style={styles.avatarSection}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {editing ? (
            <View style={styles.nameEdit}>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.nameInput}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={saveName}
              />
              <Button label={saving ? 'Sauvegarde...' : 'Sauvegarder'} onPress={saveName} loading={saving} fullWidth={false} style={{ paddingHorizontal: 16 }} />
            </View>
          ) : (
            <TouchableOpacity style={styles.nameRow} onPress={() => setEditing(true)}>
              <Text style={styles.profileName}>{profile?.full_name ?? 'Athlète'}</Text>
              <Ionicons name="pencil" size={14} color={COLORS.gray} />
            </TouchableOpacity>
          )}
          <Text style={styles.profileEmail}>{user?.email}</Text>

          {/* Plan badge */}
          {subscription && (
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>
                {subscription.plan === 'elite' ? '💎 Plan Élite' : '⚡ Plan Pro'}
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <View style={styles.badgesGrid}>
            {BADGES.map(b => (
              <View key={b.label} style={[styles.badgeCard, !b.earned && styles.badgeCardLocked]}>
                <Text style={[styles.badgeEmoji, !b.earned && { opacity: 0.3 }]}>{b.emoji}</Text>
                <Text style={[styles.badgeLabel, !b.earned && { color: COLORS.border }]}>{b.label}</Text>
                {!b.earned && (
                  <Ionicons name="lock-closed" size={12} color={COLORS.border} style={{ marginTop: 4 }} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes stats</Text>
          <View style={styles.statsRow}>
            {[
              { label: 'Séances', value: '0', icon: '💪' },
              { label: 'Semaines', value: '0', icon: '📅' },
              { label: 'Points', value: '0', icon: '⭐' },
            ].map(s => (
              <View key={s.label} style={styles.statCard}>
                <Text style={styles.statEmoji}>{s.icon}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, i < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
                onPress={() => item.route && router.push(item.route as any)}
              >
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon as any} size={18} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.section}>
          <Button label="Se déconnecter" onPress={handleSignOut} variant="danger" />
          <Text style={styles.version}>XENOTIF® v1.0.0</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.dark },
  avatarSection: { alignItems: 'center', paddingTop: SPACING.xl, paddingBottom: SPACING.xl, gap: SPACING.sm },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.orange}20`,
    borderWidth: 2,
    borderColor: `${COLORS.orange}60`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: { fontSize: 28, fontWeight: '900', color: COLORS.orange },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  profileName: { fontSize: 20, fontWeight: '900', color: '#fff' },
  profileEmail: { fontSize: 13, color: COLORS.gray },
  nameEdit: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.lg },
  nameInput: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.orange,
    paddingVertical: 4,
  },
  planBadge: {
    backgroundColor: `${COLORS.orange}20`,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: `${COLORS.orange}40`,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 4,
  },
  planBadgeText: { color: COLORS.orange, fontSize: 13, fontWeight: '800' },
  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.lg },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#fff', marginBottom: SPACING.sm },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  badgeCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: `${COLORS.orange}40`,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
  },
  badgeCardLocked: { borderColor: COLORS.border },
  badgeEmoji: { fontSize: 28 },
  badgeLabel: { fontSize: 11, color: COLORS.gray, textAlign: 'center', fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: SPACING.sm },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
  },
  statEmoji: { fontSize: 22 },
  statValue: { fontSize: 22, fontWeight: '900', color: '#fff' },
  statLabel: { fontSize: 11, color: COLORS.gray },
  menuCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 36, height: 36, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#fff' },
  version: { textAlign: 'center', color: COLORS.border, fontSize: 12, marginTop: SPACING.md },
})
