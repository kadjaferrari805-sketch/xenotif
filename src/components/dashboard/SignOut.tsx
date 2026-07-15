'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function DashboardSignOut({ iconOnly = false }: { iconOnly?: boolean }) {
  const t = useTranslations('dashboard')
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (iconOnly) {
    return (
      <button
        onClick={signOut}
        aria-label={t('signOut')}
        className="w-8 h-8 flex items-center justify-center rounded-full text-sport-gray hover:text-red-600 hover:bg-red-50 transition-all"
      >
        <LogOut size={15} />
      </button>
    )
  }

  return (
    <button
      onClick={signOut}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-sport-gray hover:text-red-600 hover:bg-red-400/5 transition-all"
    >
      <LogOut size={16} aria-hidden="true" />
      {t('signOut')}
    </button>
  )
}
