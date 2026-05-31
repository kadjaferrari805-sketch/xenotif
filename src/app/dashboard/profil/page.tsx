'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Save, CheckCircle, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ProfilPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [initials, setInitials] = useState('U')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle()
      const name = profile?.full_name ?? ''
      setFullName(name)
      setInitials(name ? name.slice(0, 2).toUpperCase() : (user.email ?? 'U').slice(0, 2).toUpperCase())
      setLoading(false)
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
    setInitials(fullName ? fullName.slice(0, 2).toUpperCase() : initials)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-sport-orange/40 border-t-sport-orange rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <h1 className="text-2xl font-black text-white mb-8">Mon Profil</h1>

      {/* Avatar */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-sport-orange/20 border-2 border-sport-orange/40 flex items-center justify-center font-black text-sport-orange text-2xl">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-sport-card border border-sport-border rounded-full flex items-center justify-center">
            <Camera size={13} className="text-sport-gray" />
          </div>
        </div>
        <div>
          <p className="text-white font-bold text-lg">{fullName || 'Athlète'}</p>
          <p className="text-sport-gray text-sm">{email}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-black text-white mb-5">Informations personnelles</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">
              Nom complet
            </label>
            <div className="relative">
              <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-sport-gray" />
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Ton prénom et nom"
                className="w-full bg-sport-dark border border-sport-border rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-sport-orange placeholder:text-sport-gray transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-sport-gray" />
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-sport-dark/50 border border-sport-border rounded-xl pl-10 pr-4 py-3 text-sport-gray text-sm cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-sport-gray mt-1.5">
              L&apos;email ne peut pas être modifié ici. Contacte le support pour le changer.
            </p>
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving || saved}
          className="mt-6 inline-flex items-center gap-2 bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 disabled:opacity-60 transition-all active:scale-95"
        >
          {saving ? (
            <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Enregistrement…</>
          ) : saved ? (
            <><CheckCircle size={14} />Sauvegardé !</>
          ) : (
            <><Save size={14} />Sauvegarder</>
          )}
        </button>
      </div>

      {/* Security */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
        <h2 className="text-sm font-black text-white mb-5">Sécurité</h2>
        <a
          href="/auth/forgot-password"
          className="inline-flex items-center gap-2 border border-sport-border text-sport-gray px-5 py-2.5 rounded-full text-sm font-bold hover:text-white hover:border-sport-gray transition-all"
        >
          Changer mon mot de passe
        </a>
      </div>
    </div>
  )
}
