import { useTranslations } from 'next-intl'
import { ShieldCheck, Lock, XCircle, MessageCircle } from 'lucide-react'

// Bandeau de réassurance sous le Hero (#13) — renforce la conversion.
export function TrustRow() {
  const t = useTranslations('trust')
  const items = [
    { Icon: Lock, label: t('securePayment'), sub: t('securePaymentSub') },
    { Icon: ShieldCheck, label: t('guarantee'), sub: t('guaranteeSub') },
    { Icon: XCircle, label: t('cancel'), sub: t('cancelSub') },
    { Icon: MessageCircle, label: t('support'), sub: t('supportSub') },
  ]
  return (
    <section aria-label={t('securePayment')} className="bg-sport-dark border-b border-sport-border px-6 py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(({ Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center">
              <Icon size={18} className="text-sport-orange" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-sport-fg leading-tight">{label}</p>
              <p className="text-[11px] text-sport-gray leading-tight">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
