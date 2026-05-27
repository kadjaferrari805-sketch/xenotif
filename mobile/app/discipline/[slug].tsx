import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { DISCIPLINES } from '@/lib/disciplines'
import { COLORS, SPACING, RADIUS } from '@/constants/theme'

const VIDEOS = [
  { title: 'Échauffement & Mobilité', duration: '10 min', level: 'Débutant' },
  { title: 'Technique de base', duration: '20 min', level: 'Débutant' },
  { title: 'Séance d\'entraînement', duration: '45 min', level: 'Intermédiaire' },
  { title: 'Récupération active', duration: '15 min', level: 'Tous niveaux' },
]

const EXERCISES = [
  { name: 'Exercice 1', sets: '3x12', muscles: 'Full body' },
  { name: 'Exercice 2', sets: '4x10', muscles: 'Haut du corps' },
  { name: 'Exercice 3', sets: '3x15', muscles: 'Cardio' },
  { name: 'Exercice 4', sets: '3x20', muscles: 'Core' },
]

export default function DisciplineDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const discipline = DISCIPLINES.find(d => d.slug === slug)

  if (!discipline) {
    router.back()
    return null
  }

  return (
    <View style={styles.container}>
      {/* Hero */}
      <LinearGradient
        colors={[discipline.color, `${discipline.color}80`, COLORS.dark]}
        style={styles.hero}
      >
        <SafeAreaView edges={['top']}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>

        <View style={styles.heroContent}>
          <Text style={styles.heroEmoji}>{discipline.emoji}</Text>
          <Text style={styles.heroTitle}>{discipline.name}</Text>
          <Text style={styles.heroDesc}>{discipline.description}</Text>

          <View style={styles.heroMeta}>
            {[
              { icon: 'time-outline', text: discipline.duration },
              { icon: 'fitness-outline', text: `${discipline.sessions} séances` },
              { icon: 'bar-chart-outline', text: discipline.level },
            ].map(m => (
              <View key={m.text} style={styles.metaChip}>
                <Ionicons name={m.icon as any} size={12} color={discipline.color} />
                <Text style={[styles.metaText, { color: discipline.color }]}>{m.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85}>
          <LinearGradient
            colors={[discipline.color, `${discipline.color}CC`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Ionicons name="play-circle" size={20} color="#fff" />
            <Text style={styles.ctaText}>Commencer le programme</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Videos */}
        <Text style={styles.sectionTitle}>Vidéos</Text>
        {VIDEOS.map((v, i) => (
          <View key={i} style={styles.videoCard}>
            <View style={[styles.videoThumb, { backgroundColor: `${discipline.color}20` }]}>
              <Ionicons name="play-circle" size={28} color={discipline.color} />
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{v.title}</Text>
              <View style={styles.videoMeta}>
                <Text style={styles.videoMetaText}>{v.duration}</Text>
                <View style={styles.dot} />
                <Text style={styles.videoMetaText}>{v.level}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
          </View>
        ))}

        {/* Exercises */}
        <Text style={styles.sectionTitle}>Exercices</Text>
        {EXERCISES.map((e, i) => (
          <View key={i} style={styles.exerciseCard}>
            <View style={[styles.exerciseNum, { backgroundColor: `${discipline.color}20`, borderColor: `${discipline.color}40` }]}>
              <Text style={[styles.exerciseNumText, { color: discipline.color }]}>{i + 1}</Text>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{e.name}</Text>
              <Text style={styles.exerciseMeta}>{e.muscles}</Text>
            </View>
            <View style={styles.setsChip}>
              <Text style={styles.setsText}>{e.sets}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  hero: { paddingBottom: SPACING.xl },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  heroContent: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  heroEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 8 },
  heroDesc: { fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 22, marginBottom: SPACING.md },
  heroMeta: { flexDirection: 'row', gap: SPACING.sm },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  metaText: { fontSize: 11, fontWeight: '700' },
  body: { flex: 1 },
  ctaBtn: { margin: SPACING.lg, borderRadius: RADIUS.xl, overflow: 'hidden' },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    gap: 8,
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  videoThumb: {
    width: 56,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfo: { flex: 1 },
  videoTitle: { fontSize: 13, fontWeight: '700', color: '#fff' },
  videoMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  videoMetaText: { fontSize: 11, color: COLORS.gray },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: COLORS.gray },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  exerciseNum: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseNumText: { fontSize: 14, fontWeight: '900' },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 13, fontWeight: '700', color: '#fff' },
  exerciseMeta: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
  setsChip: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  setsText: { fontSize: 12, color: COLORS.gray, fontWeight: '700' },
})
