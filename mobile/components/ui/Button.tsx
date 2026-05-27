import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import { COLORS, RADIUS, SPACING } from '@/constants/theme'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  fullWidth?: boolean
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, style, fullWidth = true }: ButtonProps) {
  async function handlePress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[fullWidth && { width: '100%' }, style]}
      >
        <LinearGradient
          colors={disabled ? ['#333', '#222'] : ['#FF6020', '#FF4500', '#E03000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primary}
        >
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.primaryText}>{label}</Text>
          }
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[styles.secondary, fullWidth && { width: '100%' }, style]}
      >
        {loading
          ? <ActivityIndicator color={COLORS.orange} size="small" />
          : <Text style={styles.secondaryText}>{label}</Text>
        }
      </TouchableOpacity>
    )
  }

  if (variant === 'danger') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[styles.danger, fullWidth && { width: '100%' }, style]}
      >
        <Text style={styles.dangerText}>{label}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[fullWidth && { width: '100%' }, style]}
    >
      <Text style={styles.ghostText}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  primary: {
    paddingVertical: 16,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  secondary: {
    paddingVertical: 15,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.orange,
    backgroundColor: `${COLORS.orange}15`,
  },
  secondaryText: {
    color: COLORS.orange,
    fontSize: 15,
    fontWeight: '800',
  },
  danger: {
    paddingVertical: 15,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ef444440',
    backgroundColor: '#ef444415',
  },
  dangerText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '700',
  },
  ghostText: {
    color: COLORS.orange,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
})
