import { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { MetricCard } from '@/components/ui/MetricCard'
import { COLORS, SPACING, RADIUS } from '@/constants/theme'

interface Stats {
  workouts: number
  sessions: number
  badges: number
  steps: number
  calories: number
  heartRate: number
}

export default function DashboardScreen() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<{ full_name: string } | null>(null)
  const [stats, setStats] = useState<Stats>({ workouts: 0, sessions: 0, badges: 0, steps: 8432, calories: 487, heartRate: 72 })
  const [subscription, setSubscription] = useState<{ status?: string; plan?: string } | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const firstName = (profile?.full_name ?? '').split(' ')[0] || 'Athlète'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  async function loadData() {
    if (!user) return
    const [{ data: p }, { data: sub }, { data: workouts }, { data: progress }] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', user.id).single(),
      supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
      supabase.from('workouts').select('id').eq('user_id', user.id),
      supabase.from('progress').select('id').eq('user_id', user.id).eq('completed', true),
    ])
    setProfile(p)
    setSubscription(sub)
    setStats(prev => ({
      ...prev,
      workouts: workouts?.length ?? 0,
      sessions: progress?.length ?? 0,
      badges: (progress?.length ?? 0) >= 5 ? 1 : 0,
    }))
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- chargement initial du dashboard au montage / changement d'utilisateur
  useEffect(() => { loadData() }, [user])

  async function onRefresh() {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const QUICK_ACTIONS = [
    { icon: '🏋️', label: 'Programme', route: '/(tabs)/programme' },
    { icon: '🤖', label: 'Coach IA',  route: '/coach' },
    { icon: '⌚', label: 'Montre',    route: '/(tabs)/smartwatch' },
    { icon: '📈', label: 'Stats',     route: '/(tabs)/profil' },
  ]

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.orange} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.name}>{firstName} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.gray} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Subscription banner */}
        {subscription && (
          <LinearGradient
            colors={['#FF450020', '#FF450008', '#11131800']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.subBanner}
          >
            <View>
              <View style={styles.subBadge}>
                <Text style={styles.subBadgeText}>
                  {subscription.status === 'trialing' ? '⚡ Essai gratuit' : '✓ Plan actif'}
                </Text>
              </View>
              <Text style={styles.subPlan}>Plan {subscription.plan === 'elite' ? 'Élite' : 'Pro'}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profil')}>
              <Text style={styles.subManage}>Gérer →</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}

        {/* Today's metrics */}
        <Text style={styles.sectionTitle}>Aujourd&apos;hui</Text>
        <View style={styles.metricsGrid}>
          <MetricCard icon="👟" label="Pas" value={stats.steps.toLocaleString('fr-FR')} color="#38bdf8" />
          <MetricCard icon="🔥" label="Calories" value={stats.calories.toString()} unit="kcal" color={COLORS.orange} />
        </View>
        <View style={styles.metricsGrid}>
          <MetricCard icon="❤️" label="Fréq. cardiaque" value={stats.heartRate.toString()} unit="bpm" color="#ef4444" />
          <MetricCard icon="💪" label="Séances" value={stats.sessions.toString()} color={COLORS.lime} />
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Accès rapide</Text>
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map(a => (
            <TouchableOpacity
              key={a.label}
              onPress={() => router.push(a.route as Parameters<typeof router.push>[0])}
              style={styles.quickAction}
              activeOpacity={0.75}
            >
              <LinearGradient
                colors={[COLORS.card, COLORS.card]}
                style={styles.quickActionInner}
              >
                <Text style={styles.quickActionEmoji}>{a.icon}</Text>
                <Text style={styles.quickActionLabel}>{a.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Programme promo */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/disciplines')}
          activeOpacity={0.85}
          style={styles.promoBanner}
        >
          <LinearGradient
            colors={['#FF4500', '#CC2200']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promoGradient}
          >
            <View style={styles.promoContent}>
              <Text style={styles.promoEmoji}>🏆</Text>
              <View>
                <Text style={styles.promoTitle}>Explore les disciplines</Text>
                <Text style={styles.promoSub}>10 programmes premium · 300+ séances</Text>
              </View>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats summary */}
        <Text style={styles.sectionTitle}>Ton niveau</Text>
        <View style={styles.levelCard}>
          <View style={styles.levelLeft}>
            <Text style={styles.levelEmoji}>🥇</Text>
            <View>
              <Text style={styles.levelTitle}>Athlète Confirmé</Text>
              <Text style={styles.levelSub}>{stats.sessions} séances complétées</Text>
            </View>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>Niv. 3</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.dark },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  greeting: { fontSize: 14, color: COLORS.gray, fontWeight: '600' },
  name: { fontSize: 26, fontWeight: '900', color: '#fff' },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.orange,
    borderWidth: 1.5,
    borderColor: COLORS.dark,
  },
  subBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: `${COLORS.orange}30`,
  },
  subBadge: {
    backgroundColor: `${COLORS.orange}20`,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  subBadgeText: { color: COLORS.orange, fontSize: 11, fontWeight: '800' },
  subPlan: { color: '#fff', fontSize: 13, fontWeight: '700' },
  subManage: { color: COLORS.orange, fontSize: 13, fontWeight: '700' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  quickAction: { flex: 1 },
  quickActionInner: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 6,
  },
  quickActionEmoji: { fontSize: 24 },
  quickActionLabel: { color: COLORS.gray, fontSize: 11, fontWeight: '700' },
  promoBanner: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  promoGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  promoContent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  promoEmoji: { fontSize: 32 },
  promoTitle: { color: '#fff', fontSize: 16, fontWeight: '900' },
  promoSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  levelCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  levelEmoji: { fontSize: 28 },
  levelTitle: { color: '#fff', fontSize: 15, fontWeight: '800' },
  levelSub: { color: COLORS.gray, fontSize: 12, marginTop: 2 },
  levelBadge: {
    backgroundColor: `${COLORS.orange}20`,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: `${COLORS.orange}40`,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  levelBadgeText: { color: COLORS.orange, fontSize: 12, fontWeight: '900' },
})
