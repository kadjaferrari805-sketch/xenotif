import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getCurrentUser, getProfileName } from '@/lib/supabase/session'
import { LayoutDashboard, Dumbbell, TrendingUp, CreditCard, User, Bot, Watch } from 'lucide-react'
import { DashboardSignOut } from '@/components/dashboard/SignOut'
import { DashboardGuard } from '@/components/dashboard/DashboardGuard'
import { NotificationBell } from '@/components/dashboard/NotificationBell'
import { Logo } from '@/components/ui/Logo'

const NAV = [
  { href: '/dashboard',              key: 'overview',     Icon: LayoutDashboard },
  { href: '/dashboard/coach',        key: 'coach',        Icon: Bot },
  { href: '/dashboard/programme',    key: 'programme',    Icon: Dumbbell },
  { href: '/dashboard/progression',  key: 'progression',  Icon: TrendingUp },
  { href: '/dashboard/smartwatch',   key: 'smartwatch',   Icon: Watch },
  { href: '/dashboard/abonnement',   key: 'abonnement',   Icon: CreditCard },
  { href: '/dashboard/profil',       key: 'profil',       Icon: User },
] as const

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/signin')

  const [t, fullName] = await Promise.all([getTranslations('dashboard'), getProfileName()])
  const initials = (fullName ?? user.email ?? 'U').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-sport-dark text-sport-fg flex">
      <DashboardGuard />

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sport-card border-r border-sport-border shrink-0">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-sport-border">
          <Logo href="/" size="sm" />
        </div>

        {/* User */}
        <div className="px-6 py-5 border-b border-sport-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sport-orange/20 border border-sport-orange/40 flex items-center justify-center font-black text-sport-orange text-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-sport-fg truncate">{fullName ?? t('athlete')}</p>
              <p className="text-[11px] text-sport-gray truncate">{user.email}</p>
            </div>
            <NotificationBell align="left" />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4" aria-label={t('navAria')}>
          <ul className="space-y-1">
            {NAV.map(({ href, key, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-sport-gray hover:text-sport-fg hover:bg-sport-fg/5 transition-all group"
                >
                  <Icon size={16} className="shrink-0 group-hover:text-sport-orange transition-colors" aria-hidden="true" />
                  {t(`nav.${key}`)}
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sport-card border-b border-sport-border px-4 pb-3 dash-header-safe flex items-center justify-between">
        <Logo href="/" size="sm" />
        <div className="flex items-center gap-2">
          <NotificationBell align="right" />
          <div className="w-8 h-8 rounded-full bg-sport-orange/20 border border-sport-orange/40 flex items-center justify-center font-black text-sport-orange text-xs">
            {initials}
          </div>
          <DashboardSignOut iconOnly />
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 dash-main">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sport-card border-t border-sport-border px-2 pt-2 dash-nav-safe flex justify-around z-50">
        {NAV.map(({ href, key, Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-1 px-3 py-1.5 text-sport-gray hover:text-sport-orange transition-colors">
            <Icon size={18} aria-hidden="true" />
            <span className="text-[9px] font-semibold">{t(`nav.${key}`).split(' ')[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
