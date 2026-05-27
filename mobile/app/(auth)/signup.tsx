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

export default function SignUpScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignUp() {
    if (!name || !email || !password) {
      Alert.alert('Erreur', 'Remplis tous les champs.')
      return
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit faire au moins 6 caractères.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    setLoading(false)
    if (error) {
      Alert.alert('Erreur', error.message)
    } else {
      Alert.alert(
        'Compte créé !',
        'Vérifie ton email pour confirmer ton inscription.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/signin') }]
      )
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>

          <View style={styles.logoWrap}>
            <LinearGradient colors={['#FF6020', '#FF4500']} style={styles.logoBox}>
              <Text style={styles.logoX}>X</Text>
            </LinearGradient>
          </View>

          <Text style={styles.title}>Crée ton compte</Text>
          <Text style={styles.sub}>Rejoins des milliers d&apos;athlètes</Text>

          <View style={styles.form}>
            {[
              { label: 'Prénom & Nom', value: name, set: setName, placeholder: 'Jean Dupont', type: 'default' },
              { label: 'Email', value: email, set: setEmail, placeholder: 'ton@email.com', type: 'email-address' },
              { label: 'Mot de passe', value: password, set: setPassword, placeholder: '••••••••', type: 'default', secure: true },
            ].map(f => (
              <View key={f.label} style={styles.field}>
                <Text style={styles.label}>{f.label}</Text>
                <TextInput
                  value={f.value}
                  onChangeText={f.set}
                  placeholder={f.placeholder}
                  placeholderTextColor={COLORS.gray}
                  keyboardType={f.type as any}
                  autoCapitalize={f.type === 'email-address' ? 'none' : 'words'}
                  secureTextEntry={f.secure}
                  style={styles.input}
                />
              </View>
            ))}
          </View>

          <Button label="Créer mon compte" onPress={handleSignUp} loading={loading} />

          <Text style={styles.legal}>
            En t&apos;inscrivant tu acceptes nos{' '}
            <Text style={styles.legalLink}>Conditions d&apos;utilisation</Text>
            {' '}et notre{' '}
            <Text style={styles.legalLink}>Politique de confidentialité</Text>.
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.dark },
  container: { flex: 1 },
  scroll: { padding: SPACING.lg, paddingTop: SPACING.lg },
  back: { marginBottom: SPACING.lg },
  backText: { color: COLORS.orange, fontSize: 15, fontWeight: '700' },
  logoWrap: { marginBottom: SPACING.xl },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoX: { color: '#fff', fontSize: 24, fontWeight: '900' },
  title: { fontSize: 30, fontWeight: '900', color: '#fff', marginBottom: 8 },
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
  legal: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 18,
  },
  legalLink: { color: COLORS.orange, fontWeight: '700' },
})
