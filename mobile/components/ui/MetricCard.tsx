import { View, Text, StyleSheet } from 'react-native'
import { COLORS, RADIUS, SPACING } from '@/constants/theme'

interface MetricCardProps {
  icon: string
  label: string
  value: string
  unit?: string
  color?: string
  trend?: number
}

export function MetricCard({ icon, label, value, unit, color = COLORS.orange, trend }: MetricCardProps) {
  return (
    <View style={[styles.card, { borderColor: `${color}25` }]}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}15` }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      {trend !== undefined && (
        <Text style={[styles.trend, { color: trend >= 0 ? COLORS.success : COLORS.error }]}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 140,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: '600',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
  },
  unit: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: '600',
  },
  trend: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
})
