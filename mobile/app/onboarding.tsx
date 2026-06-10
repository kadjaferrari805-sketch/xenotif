import { useState, useRef } from 'react'
import {
  View, Text, StyleSheet, Dimensions, FlatList,
  TouchableOpacity, Animated,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { COLORS, SPACING, RADIUS } from '@/constants/theme'

const { width, height } = Dimensions.get('window')

const SLIDES = [
  {
    id: '1',
    emoji: '🏆',
    title: 'Bienvenue sur\nXENOTIF®',
    subtitle: 'La plateforme fitness premium qui t\'accompagne vers tes objectifs.',
    bg: ['#FF4500', '#CC2200'],
  },
  {
    id: '2',
    emoji: '💪',
    title: '10 Disciplines\nPremium',
    subtitle: 'Running, Musculation, HIIT, Yoga, Boxe et plus encore — tout en un.',
    bg: ['#2563EB', '#1040A0'],
  },
  {
    id: '3',
    emoji: '⌚',
    title: 'Montre Connectée\nIntégrée',
    subtitle: 'Synchronise Apple Watch, Garmin, Fitbit et suis tes performances en temps réel.',
    bg: ['#7c3aed', '#4c1d95'],
  },
  {
    id: '4',
    emoji: '🤖',
    title: 'Coach IA\nPersonnalisé',
    subtitle: 'Ton coach intelligent disponible 24h/24 pour t\'aider à progresser.',
    bg: ['#059669', '#064e3b'],
  },
]

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  // Animated.Value créée une seule fois via l'initialiseur paresseux (pas de ref lue pendant le rendu).
  const [scrollX] = useState(() => new Animated.Value(0))

  function goNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
      setCurrentIndex(currentIndex + 1)
    } else {
      router.replace('/(auth)/signin')
    }
  }

  function skip() {
    router.replace('/(auth)/signin')
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={e => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <LinearGradient colors={[...item.bg, '#0A0B0F'] as unknown as import('expo-linear-gradient').LinearGradientProps['colors']} style={styles.slide}>
            <SafeAreaView style={styles.slideInner}>
              <Text style={styles.emoji}>{item.emoji}</Text>

              {/* Logo */}
              <View style={styles.logoRow}>
                <View style={styles.logoBox}>
                  <Text style={styles.logoX}>X</Text>
                </View>
                <Text style={styles.logoText}>XENOTIF®</Text>
              </View>

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </SafeAreaView>
          </LinearGradient>
        )}
      />

      {/* Bottom controls */}
      <SafeAreaView style={styles.controls} edges={['bottom']}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity onPress={skip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Passer</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goNext} style={styles.nextBtn} activeOpacity={0.85}>
            <LinearGradient
              colors={['#FF6020', '#FF4500']}
              style={styles.nextGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextText}>
                {currentIndex === SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
              </Text>
              <Text style={styles.nextArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  slide: {
    width,
    height: height * 0.78,
  },
  slideInner: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 72,
    marginBottom: SPACING.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.xl,
  },
  logoBox: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoX: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 44,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 24,
  },
  controls: {
    backgroundColor: COLORS.dark,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: SPACING.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.orange,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  skipBtn: {
    paddingVertical: 16,
    paddingHorizontal: SPACING.lg,
  },
  skipText: {
    color: COLORS.gray,
    fontSize: 15,
    fontWeight: '600',
  },
  nextBtn: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  nextArrow: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
})
