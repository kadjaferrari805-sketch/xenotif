import { useState } from 'react'
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { DISCIPLINES } from '@/lib/disciplines'
import { COLORS, SPACING, RADIUS } from '@/constants/theme'

export default function DisciplinesScreen() {
  const [search, setSearch] = useState('')

  const filtered = DISCIPLINES.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Disciplines</Text>
          <Text style={styles.sub}>10 programmes premium</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher une discipline..."
          placeholderTextColor={COLORS.gray}
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={d => d.slug}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: SPACING.sm }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardWrap}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/discipline/[slug]', params: { slug: item.slug } })}
          >
            <LinearGradient
              colors={[`${item.color}25`, COLORS.card]}
              style={styles.card}
            >
              <View style={[styles.emojiWrap, { backgroundColor: `${item.color}20`, borderColor: `${item.color}40` }]}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardLevel}>{item.level}</Text>
              <View style={styles.cardMeta}>
                <View style={styles.metaChip}>
                  <Ionicons name="time-outline" size={10} color={COLORS.gray} />
                  <Text style={styles.metaText}>{item.duration}</Text>
                </View>
                <View style={[styles.metaChip, { backgroundColor: `${item.color}15`, borderColor: `${item.color}30` }]}>
                  <Text style={[styles.metaText, { color: item.color }]}>{item.sessions} séances</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune discipline trouvée</Text>
          </View>
        }
      />
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
  title: { fontSize: 28, fontWeight: '900', color: '#fff' },
  sub: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  searchIcon: {},
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 12,
  },
  grid: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    paddingBottom: 100,
  },
  cardWrap: { flex: 1 },
  card: {
    flex: 1,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  emojiWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emoji: { fontSize: 22 },
  cardName: { fontSize: 14, fontWeight: '900', color: '#fff', lineHeight: 18 },
  cardLevel: { fontSize: 10, color: COLORS.gray, fontWeight: '600' },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.dark,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  metaText: { fontSize: 9, color: COLORS.gray, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: COLORS.gray, fontSize: 15 },
})
