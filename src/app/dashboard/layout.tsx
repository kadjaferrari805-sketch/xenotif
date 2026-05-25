import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Dumbbell, TrendingUp, CreditCard, LogOut, Settings } from 'lucide-react'
import { DashboardSignOut } from '@/components/dashboard/SignOut'

const NAV = [
  { href: '/dashboard',              label: 'Vue d\'ensemble', Icon: LayoutDashboard },
  { href: '/dashboard/programme',    label: 'Mon Programme',   Icon: Dumbbell },
  { href: '/dashboard/progression',  label: 'Progression',     Icon: TrendingUp },
  { href: '/dashboard/abonnement',   label: 'Abonnement',      Icon: CreditCard },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
  const initials = (profile?.full_name ?? user.email ?? 'U').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-sport-dark text-white flex">

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sport-card border-r border-sport-border shrink-0">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-sport-border">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-sport-orange rounded-lg flex items-center justify-center font-black text-white text-sm">X</span>
            <span className="font-black text-white tracking-wider">XENOTIF®</span>
          </Link>
        </div>

        {/* User */}
        <div className="px-6 py-5 border-b border-sport-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sport-orange/20 border border-sport-orange/40 flex items-center justify-center font-black text-sport-orange text-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{profile?.full_name ?? 'Athlète'}</p>
              <p className="text-[11px] text-sport-gray truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4" aria-label="Navigation dashboard">
          <ul className="space-y-1">
            {NAV.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-sport-gray hover:text-white hover:bg-white/5 transition-all group"
                >
                  <Icon size={16} className="shrink-0 group-hover:text-sport-orange transition-colors" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-sport-border space-y-1">
          <DashboardSignOut />
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sport-card border-b border-sport-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-7 h-7 bg-sport-orange rounded-md flex items-center justify-center font-black text-white text-xs">X</span>
          <span className="font-black text-white text-sm tracking-wider">XENOTIF®</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sport-orange/20 border border-sport-orange/40 flex items-center justify-center font-black text-sport-orange text-xs">
            {initials}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 md:pt-0 pt-14">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sport-card border-t border-sport-border px-2 py-2 flex justify-around z-50">
        {NAV.map(({ href, label, Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-1 px-3 py-1.5 text-sport-gray hover:text-sport-orange transition-colors">
            <Icon size={18} aria-hidden="true" />
            <span className="text-[9px] font-semibold">{label.split(' ')[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
