import { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { DISCIPLINES } from '@/lib/disciplines'
import { COLORS, SPACING, RADIUS } from '@/constants/theme'

const WEEKS = Array.from({ length: 12 }, (_, i) => ({
  week: i + 1,
  sessions: ['Séance A', 'Séance B', 'Séance C'],
}))

export default function ProgrammeScreen() {
  const { user } = useAuth()
  const [selectedSlug, setSelectedSlug] = useState('running-cardio')
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [completing, setCompleting] = useState<string | null>(null)

  const discipline = DISCIPLINES.find(d => d.slug === selectedSlug)!

  useEffect(() => {
    if (!user) return
    supabase
      .from('progress')
      .select('session_name, completed')
      .eq('user_id', user.id)
      .eq('discipline', selectedSlug)
      .then(({ data }) => {
        const map: Record<string, boolean> = {}
        data?.forEach(p => { map[p.session_name] = p.completed })
        setProgress(map)
      })
  }, [user, selectedSlug])

  const completed = Object.values(progress).filter(Boolean).length
  const total = WEEKS.reduce((a, w) => a + w.sessions.length, 0)
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  async function toggleSession(week: number, session: string) {
    if (!user) return
    const key = `W${week}-${session}`
    const nowDone = !progress[key]
    setCompleting(key)
    setProgress(prev => ({ ...prev, [key]: nowDone }))
    await supabase.from('progress').upsert({
      user_id: user.id,
      discipline: selectedSlug,
      week,
      session_name: key,
      completed: nowDone,
      completed_at: nowDone ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,discipline,week,session_name' })
    setCompleting(null)
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mon Programme</Text>
          <Text style={styles.sub}>Suis ta progression semaine par semaine</Text>
        </View>

        {/* Discipline selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorScroll}
        >
          {DISCIPLINES.slice(0, 6).map(d => (
            <TouchableOpacity
              key={d.slug}
              onPress={() => setSelectedSlug(d.slug)}
              style={[
                styles.selectorChip,
                selectedSlug === d.slug && { backgroundColor: `${d.color}20`, borderColor: `${d.color}60` },
              ]}
            >
              <Text style={styles.chipEmoji}>{d.emoji}</Text>
              <Text style={[styles.chipText, selectedSlug === d.slug && { color: d.color }]}>{d.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Progress card */}
        <LinearGradient
          colors={[`${discipline.color}20`, COLORS.card]}
          style={styles.progressCard}
        >
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressName}>{discipline.name}</Text>
              <Text style={styles.progressSub}>{discipline.duration} · {total} séances</Text>
            </View>
            <Text style={[styles.progressPct, { color: discipline.color }]}>{pct}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: discipline.color }]} />
          </View>
          <Text style={styles.progressCount}>{completed}/{total} séances complétées</Text>
        </LinearGradient>

        {/* Weekly sessions */}
        {WEEKS.slice(0, 4).map(w => (
          <View key={w.week} style={styles.weekCard}>
            <Text style={styles.weekTitle}>Semaine {w.week}</Text>
            {w.sessions.map(session => {
              const key = `W${w.week}-${session}`
              const done = progress[key] ?? false
              const loading = completing === key
              return (
                <TouchableOpacity
                  key={session}
                  onPress={() => toggleSession(w.week, session)}
                  disabled={loading}
                  style={[styles.sessionRow, done && styles.sessionRowDone]}
                  activeOpacity={0.75}
                >
                  <View style={[styles.sessionCheck, done && { backgroundColor: discipline.color, borderColor: discipline.color }]}>
                    {done && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={[styles.sessionName, done && styles.sessionNameDone]}>{session}</Text>
                    <Text style={styles.sessionMeta}>45 min · {discipline.level}</Text>
                  </View>
                  {done ? (
                    <View style={[styles.sessionBadge, { backgroundColor: `${discipline.color}20`, borderColor: `${discipline.color}40` }]}>
                      <Text style={[styles.sessionBadgeText, { color: discipline.color }]}>Fait</Text>
                    </View>
                  ) : (
                    <Ionicons name="play-circle-outline" size={22} color={COLORS.gray} />
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
        ))}

        <TouchableOpacity style={styles.allWeeksBtn}>
          <Text style={styles.allWeeksText}>Voir les 12 semaines</Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.orange} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.dark },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  title: { fontSize: 26, fontWeight: '900', color: '#fff' },
  sub: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  selectorScroll: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, gap: SPACING.sm },
  selectorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipEmoji: { fontSize: 16 },
  chipText: { fontSize: 13, fontWeight: '700', color: COLORS.gray },
  progressCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  progressName: { fontSize: 18, fontWeight: '900', color: '#fff' },
  progressSub: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  progressPct: { fontSize: 28, fontWeight: '900' },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: RADIUS.full },
  progressCount: { fontSize: 12, color: COLORS.gray },
  weekCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  weekTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.gray,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sessionRowDone: { opacity: 0.7 },
  sessionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionInfo: { flex: 1 },
  sessionName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  sessionNameDone: { textDecorationLine: 'line-through', color: COLORS.gray },
  sessionMeta: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
  sessionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  sessionBadgeText: { fontSize: 11, fontWeight: '800' },
  allWeeksBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.md,
    padding: SPACING.md,
  },
  allWeeksText: { color: COLORS.orange, fontSize: 14, fontWeight: '700' },
})
