'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function DashboardSignOut() {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={signOut}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-sport-gray hover:text-red-400 hover:bg-red-400/5 transition-all"
    >
      <LogOut size={16} aria-hidden="true" />
      Se déconnecter
    </button>
  )
}
