'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { User, Mail, Save, CheckCircle, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function ProfilClient({ initialName, email, userId }: { initialName: string; email: string; userId: string }) {
  const t = useTranslations('dashboard')
  const [fullName, setFullName] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [initials, setInitials] = useState(
    initialName ? initialName.slice(0, 2).toUpperCase() : (email || 'U').slice(0, 2).toUpperCase(),
  )

  async function save() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', userId)
    setInitials(fullName ? fullName.slice(0, 2).toUpperCase() : initials)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <h1 className="text-2xl font-black text-sport-fg mb-8">{t('profil.title')}</h1>

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
          <p className="text-sport-fg font-bold text-lg">{fullName || t('athlete')}</p>
          <p className="text-sport-gray text-sm">{email}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-black text-sport-fg mb-5">{t('profil.personalInfo')}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">
              {t('profil.fullName')}
            </label>
            <div className="relative">
              <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-sport-gray" />
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder={t('profil.fullNamePlaceholder')}
                className="w-full bg-sport-dark border border-sport-border rounded-xl pl-10 pr-4 py-3 text-sport-fg text-sm focus:outline-none focus:border-sport-orange placeholder:text-sport-gray transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">
              {t('profil.email')}
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
              {t('profil.emailNote')}
            </p>
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving || saved}
          className="mt-6 inline-flex items-center gap-2 bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 disabled:opacity-60 transition-all active:scale-95"
        >
          {saving ? (
            <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('profil.saving')}</>
          ) : saved ? (
            <><CheckCircle size={14} />{t('profil.saved')}</>
          ) : (
            <><Save size={14} />{t('profil.save')}</>
          )}
        </button>
      </div>

      {/* Security */}
      <div className="bg-sport-card border border-sport-border rounded-2xl p-6">
        <h2 className="text-sm font-black text-sport-fg mb-5">{t('profil.security')}</h2>
        <Link
          href="/auth/forgot-password"
          className="inline-flex items-center gap-2 border border-sport-border text-sport-gray px-5 py-2.5 rounded-full text-sm font-bold hover:text-sport-fg hover:border-sport-gray transition-all"
        >
          {t('profil.changePassword')}
        </Link>
      </div>
    </div>
  )
}
