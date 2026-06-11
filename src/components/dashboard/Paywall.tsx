import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Lock, ArrowRight, CheckCircle } from 'lucide-react'

// Écran affiché à la place du contenu PRO pour un utilisateur non-abonné.
export async function Paywall() {
  const t = await getTranslations('dashboard.paywall')
  const features = t.raw('features') as string[]

  return (
    <div className="p-6 md:p-10 max-w-xl mx-auto pb-24 md:pb-10">
      <div className="rounded-2xl border border-sport-border bg-sport-card p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sport-orange/15 border border-sport-orange/30">
          <Lock size={24} className="text-sport-orange" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">{t('title')}</h1>
        <p className="text-sport-gray text-sm leading-relaxed mb-6">{t('subtitle')}</p>

        <ul className="space-y-2.5 text-left mb-8">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-sport-gray">
              <CheckCircle size={15} className="shrink-0 mt-0.5 text-sport-orange" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>

        <Link
          href="/auth/signup?plan=pro"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sport-orange px-6 py-3.5 font-bold text-sm text-white hover:bg-orange-600 transition-all"
        >
          {t('cta')} <ArrowRight size={14} aria-hidden="true" />
        </Link>

        <p className="text-[11px] text-sport-gray mt-4">{t('trialNote')}</p>
      </div>
    </div>
  )
}
