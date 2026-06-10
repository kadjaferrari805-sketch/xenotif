import { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SPACING, RADIUS } from '@/constants/theme'
import { MetricCard } from '@/components/ui/MetricCard'

const DEVICES = [
  { id: 'apple_health', name: 'Apple Watch', emoji: '⌚', color: '#fff', desc: 'HealthKit' },
  { id: 'google_fit',   name: 'Google Fit',  emoji: '🏃', color: '#4285F4', desc: 'Fitness API' },
  { id: 'fitbit',       name: 'Fitbit',       emoji: '💪', color: '#00B0B9', desc: 'Fitbit API' },
  { id: 'garmin',       name: 'Garmin',       emoji: '🗺️', color: '#007CC2', desc: 'Health API' },
]

const ZONES = [
  { label: 'Repos',          range: '< 100 bpm', color: '#60a5fa', pct: 45 },
  { label: 'Cardio léger',   range: '100-130',   color: '#34d399', pct: 30 },
  { label: 'Cardio modéré',  range: '130-155',   color: '#fbbf24', pct: 15 },
  { label: 'Intense',        range: '155-175',   color: '#f97316', pct: 8 },
  { label: 'Max',            range: '> 175 bpm', color: '#ef4444', pct: 2 },
]

export default function SmartwatchScreen() {
  const [connected, setConnected] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [beat, setBeat] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setBeat(true)
      setTimeout(() => setBeat(false), 150)
    }, Math.round(60000 / 72))
    return () => clearInterval(interval)
  }, [])

  async function connectDevice(id: string) {
    if (id === 'apple_health') {
      Alert.alert(
        'Apple Watch',
        'L\'intégration Apple HealthKit est disponible sur iPhone. Active le partage de données santé dans l\'app Santé d\'Apple.',
        [{ text: 'Compris' }]
      )
      return
    }
    setSyncing(true)
    await new Promise(r => setTimeout(r, 1500))
    setConnected(id)
    setSyncing(false)
    Alert.alert('✅ Connecté !', 'Ta montre est maintenant synchronisée.')
  }

  function disconnect() {
    Alert.alert('Déconnecter', 'Supprimer la connexion avec cet appareil ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnecter', style: 'destructive', onPress: () => setConnected(null) },
    ])
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Montre Connectée</Text>
            <Text style={styles.sub}>Sync fitness en temps réel</Text>
          </View>
          {connected && (
            <TouchableOpacity
              onPress={() => { setSyncing(true); setTimeout(() => setSyncing(false), 2000) }}
              style={styles.syncBtn}
            >
              {syncing
                ? <ActivityIndicator color={COLORS.orange} size="small" />
                : <Ionicons name="refresh" size={18} color={COLORS.orange} />
              }
            </TouchableOpacity>
          )}
        </View>

        {/* Today metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aujourd&apos;hui</Text>
          <View style={styles.metricsGrid}>
            <MetricCard icon="👟" label="Pas" value="8 432" color="#38bdf8" />
            <MetricCard icon="🔥" label="Calories" value="487" unit="kcal" color={COLORS.orange} />
          </View>
          <View style={[styles.metricsGrid, { marginTop: SPACING.sm }]}>
            <MetricCard icon="📍" label="Distance" value="6.2" unit="km" color="#a78bfa" />
            <MetricCard icon="⚡" label="Min actives" value="47" unit="min" color={COLORS.lime} />
          </View>
        </View>

        {/* Heart rate */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fréquence cardiaque</Text>
          <View style={styles.hrCard}>
            <View style={styles.hrLeft}>
              <View style={[
                styles.hrIcon,
                { transform: [{ scale: beat ? 1.2 : 1 }] }
              ]}>
                <Text style={{ fontSize: 22 }}>❤️</Text>
              </View>
              <View>
                <View style={styles.hrValueRow}>
                  <Text style={styles.hrValue}>72</Text>
                  <Text style={styles.hrUnit}>bpm</Text>
                </View>
                <Text style={styles.hrZone}>Zone repos</Text>
              </View>
            </View>
            <View style={styles.hrStats}>
              <View style={styles.hrStat}>
                <Text style={styles.hrStatLabel}>Max</Text>
                <Text style={styles.hrStatValue}>156</Text>
              </View>
              <View style={styles.hrStat}>
                <Text style={styles.hrStatLabel}>Repos</Text>
                <Text style={styles.hrStatValue}>58</Text>
              </View>
            </View>
          </View>

          {/* HR Zones */}
          <View style={styles.zonesCard}>
            <Text style={styles.zonesTitle}>Zones d&apos;entraînement</Text>
            {ZONES.map(z => (
              <View key={z.label} style={styles.zone}>
                <View style={styles.zoneLeft}>
                  <View style={[styles.zoneDot, { backgroundColor: z.color }]} />
                  <Text style={styles.zoneLabel}>{z.label}</Text>
                </View>
                <View style={styles.zoneBar}>
                  <View style={[styles.zoneBarFill, { width: `${z.pct}%` as import('react-native').DimensionValue, backgroundColor: z.color }]} />
                </View>
                <Text style={styles.zonePct}>{z.pct}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sleep */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sommeil</Text>
          <LinearGradient
            colors={['#4c1d9520', COLORS.card]}
            style={styles.sleepCard}
          >
            <View style={styles.sleepTop}>
              <Text style={styles.sleepEmoji}>🌙</Text>
              <View>
                <Text style={styles.sleepValue}>7h 12min</Text>
                <Text style={styles.sleepSub}>Score : 78/100</Text>
              </View>
              <View style={styles.sleepScore}>
                <Text style={styles.sleepScoreText}>Bon</Text>
              </View>
            </View>
            <View style={styles.sleepBar}>
              <View style={[styles.sleepPhase, { flex: 2, backgroundColor: '#4c1d95' }]} />
              <View style={[styles.sleepPhase, { flex: 5, backgroundColor: '#818cf8' }]} />
              <View style={[styles.sleepPhase, { flex: 3, backgroundColor: '#a5b4fc' }]} />
            </View>
            <View style={styles.sleepLegend}>
              {[
                { label: 'Profond', color: '#4c1d95' },
                { label: 'Léger', color: '#818cf8' },
                { label: 'REM', color: '#a5b4fc' },
              ].map(p => (
                <View key={p.label} style={styles.sleepLegendItem}>
                  <View style={[styles.sleepDot, { backgroundColor: p.color }]} />
                  <Text style={styles.sleepLegendText}>{p.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Devices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appareils</Text>
          {DEVICES.map(d => (
            <View key={d.id} style={[styles.deviceCard, connected === d.id && { borderColor: `${d.color}50` }]}>
              <View style={[styles.deviceIcon, { backgroundColor: `${d.color}15`, borderColor: `${d.color}30` }]}>
                <Text style={styles.deviceEmoji}>{d.emoji}</Text>
              </View>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{d.name}</Text>
                <Text style={styles.deviceDesc}>{d.desc}</Text>
              </View>
              {connected === d.id ? (
                <TouchableOpacity onPress={disconnect} style={styles.disconnectBtn}>
                  <Ionicons name="checkmark-circle" size={20} color="#34d399" />
                  <Text style={styles.disconnectText}>Connecté</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => connectDevice(d.id)}
                  style={[styles.connectBtn, { borderColor: `${d.color}40`, backgroundColor: `${d.color}10` }]}
                  disabled={syncing}
                >
                  {syncing
                    ? <ActivityIndicator size="small" color={d.color} />
                    : <Text style={[styles.connectText, { color: d.color }]}>Connecter</Text>
                  }
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* RGPD note */}
          <View style={styles.rgpdNote}>
            <Ionicons name="lock-closed" size={14} color="#34d399" />
            <Text style={styles.rgpdText}>Données chiffrées et conformes RGPD</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.dark },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: { fontSize: 26, fontWeight: '900', color: '#fff' },
  sub: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  syncBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: `${COLORS.orange}15`,
    borderWidth: 1,
    borderColor: `${COLORS.orange}30`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.lg },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#fff', marginBottom: SPACING.sm },
  metricsGrid: { flexDirection: 'row', gap: SPACING.sm },
  hrCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#ef444430',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  hrLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  hrIcon: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  hrValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  hrValue: { fontSize: 28, fontWeight: '900', color: '#ef4444' },
  hrUnit: { fontSize: 13, color: COLORS.gray },
  hrZone: { fontSize: 11, color: '#60a5fa', fontWeight: '700', marginTop: 2 },
  hrStats: { gap: 8 },
  hrStat: { alignItems: 'center' },
  hrStatLabel: { fontSize: 10, color: COLORS.gray },
  hrStatValue: { fontSize: 15, fontWeight: '900', color: '#fff' },
  zonesCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  zonesTitle: { fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 4 },
  zone: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  zoneLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 100 },
  zoneDot: { width: 8, height: 8, borderRadius: 4 },
  zoneLabel: { fontSize: 11, color: COLORS.gray, fontWeight: '600' },
  zoneBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.dark,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  zoneBarFill: { height: '100%', borderRadius: RADIUS.full },
  zonePct: { fontSize: 10, color: COLORS.gray, width: 28, textAlign: 'right' },
  sleepCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#4c1d9540',
    gap: SPACING.md,
  },
  sleepTop: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  sleepEmoji: { fontSize: 28 },
  sleepValue: { fontSize: 20, fontWeight: '900', color: '#fff' },
  sleepSub: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  sleepScore: {
    marginLeft: 'auto',
    backgroundColor: '#34d39920',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#34d39940',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sleepScoreText: { color: '#34d399', fontSize: 12, fontWeight: '800' },
  sleepBar: { flexDirection: 'row', height: 10, borderRadius: RADIUS.full, overflow: 'hidden', gap: 2 },
  sleepPhase: { borderRadius: 2 },
  sleepLegend: { flexDirection: 'row', gap: SPACING.md },
  sleepLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sleepDot: { width: 8, height: 8, borderRadius: 4 },
  sleepLegendText: { fontSize: 10, color: COLORS.gray },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  deviceIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceEmoji: { fontSize: 20 },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: 14, fontWeight: '800', color: '#fff' },
  deviceDesc: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
  connectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  connectText: { fontSize: 12, fontWeight: '800' },
  disconnectBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  disconnectText: { fontSize: 12, color: '#34d399', fontWeight: '700' },
  rgpdNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#34d39910',
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#34d39920',
    marginTop: SPACING.sm,
  },
  rgpdText: { fontSize: 12, color: '#34d399', fontWeight: '600' },
})
