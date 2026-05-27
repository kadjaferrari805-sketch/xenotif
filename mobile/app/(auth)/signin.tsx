import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { COLORS, SPACING, RADIUS } from '@/constants/theme'

export default function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Erreur', 'Remplis tous les champs.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      Alert.alert('Erreur de connexion', error.message)
    } else {
      router.replace('/(tabs)')
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={styles.logoWrap}>
            <LinearGradient colors={['#FF6020', '#FF4500']} style={styles.logoBox}>
              <Text style={styles.logoX}>X</Text>
            </LinearGradient>
            <Text style={styles.logoText}>XENOTIF®</Text>
          </View>

          <Text style={styles.title}>Bon retour 👋</Text>
          <Text style={styles.sub}>Connecte-toi à ton espace fitness</Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="ton@email.com"
                placeholderTextColor={COLORS.gray}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.passwordWrap}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.gray}
                  secureTextEntry={!showPassword}
                  style={[styles.input, { flex: 1, borderWidth: 0 }]}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgot}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          <Button label="Se connecter" onPress={handleSignIn} loading={loading} />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={styles.signupBtn}>
            <Text style={styles.signupText}>
              Pas encore de compte ? <Text style={styles.signupLink}>S&apos;inscrire</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.dark },
  container: { flex: 1 },
  scroll: { padding: SPACING.lg, paddingTop: SPACING.xxl },
  logoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.xxl,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoX: { color: '#fff', fontSize: 22, fontWeight: '900' },
  logoText: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 3 },
  title: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 8 },
  sub: { fontSize: 15, color: COLORS.gray, marginBottom: SPACING.xl },
  form: { gap: SPACING.md, marginBottom: SPACING.lg },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.gray },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },
  eyeBtn: { padding: 10 },
  eyeIcon: { fontSize: 16 },
  forgot: { alignSelf: 'flex-end' },
  forgotText: { color: COLORS.orange, fontSize: 13, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginVertical: SPACING.lg },
  line: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.gray, fontSize: 13 },
  signupBtn: { alignItems: 'center' },
  signupText: { color: COLORS.gray, fontSize: 14 },
  signupLink: { color: COLORS.orange, fontWeight: '800' },
})
