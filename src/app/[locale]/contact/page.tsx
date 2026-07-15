'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Mail, MessageSquare, CheckCircle, Zap, Clock, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input, Select, Textarea, Label } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion'

// Sujet pré-sélectionné via ?sujet=elite (lien envoyé depuis la carte tarifaire
// Elite, cf. Pricing.tsx) - mappe vers le libellé exact de home.contact.subjects.
const SUBJECT_FROM_QUERY: Record<string, number> = { elite: 3 }

function ContactForm() {
  const t = useTranslations('contact')
  const searchParams = useSearchParams()
  const subjects = t.raw('subjects') as string[]
  const sujetParam = searchParams.get('sujet')
  const initialSubject = (sujetParam && SUBJECT_FROM_QUERY[sujetParam] !== undefined
    ? subjects[SUBJECT_FROM_QUERY[sujetParam]]
    : subjects[0]) ?? subjects[0]
  const [form, setForm] = useState({ name: '', email: '', subject: initialSubject, message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.ok) {
      setSuccess(true)
    } else {
      setError(data.error ?? t('error'))
    }
    setLoading(false)
  }

  const faq = t.raw('faq') as { question: string; answer: string }[]

  return (
    <div className="min-h-screen bg-sport-dark">

      {/* Hero */}
      <div className="relative overflow-hidden py-20 px-6 border-b border-sport-border">
        <div className="absolute inset-0 bg-gradient-to-br from-sport-orange/5 via-transparent to-sport-blue/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-sport-orange/10 border border-sport-orange/20 text-sport-orange text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <MessageSquare size={12} />
            {t('badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-sport-fg mb-4">
            {t('heroTitle')}
          </h1>
          <p className="text-sport-gray text-lg max-w-xl mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-5 gap-12">

        {/* Info column */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-black text-sport-fg mb-4">{t('infoTitle')}</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center shrink-0">
                  <Mail size={15} className="text-sport-orange" />
                </div>
                <div>
                  <p className="text-xs font-bold text-sport-fg mb-0.5">{t('emailLabel')}</p>
                  <a href="mailto:contact@xenotif.com" className="text-sm text-sport-gray hover:text-sport-orange transition-colors">
                    contact@xenotif.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sport-blue/10 border border-sport-blue/20 flex items-center justify-center shrink-0">
                  <Clock size={15} className="text-sport-blue" />
                </div>
                <div>
                  <p className="text-xs font-bold text-sport-fg mb-0.5">{t('responseLabel')}</p>
                  <p className="text-sm text-sport-gray">{t('responseValue')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <MapPin size={15} className="text-[#1E7F5A]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-sport-fg mb-0.5">Xenotif®</p>
                  <p className="text-sm text-sport-gray">xenotif.com</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-5 hover:-translate-y-0 hover:shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-sport-orange" />
              <p className="text-xs font-black text-sport-fg uppercase tracking-wider">{t('subscriberTitle')}</p>
            </div>
            <p className="text-xs text-sport-gray mb-4 leading-relaxed">
              {t('subscriberDesc')}
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sport-orange text-xs font-bold hover:underline"
            >
              {t('mySpace')} <ArrowRight size={11} />
            </Link>
          </Card>

          {/* FAQ */}
          <div>
            <h2 className="text-lg font-black text-sport-fg mb-2">{t('faqTitle')}</h2>
            <Accordion type="single" collapsible className="card-base px-5">
              {faq.map((item, i) => (
                <AccordionItem key={item.question} value={`faq-${i}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Form column */}
        <div className="md:col-span-3">
          {success ? (
            <Card className="p-10 text-center border-emerald-200 hover:-translate-y-0 hover:shadow-sm">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={28} className="text-[#1E7F5A]" />
              </div>
              <h2 className="text-xl font-black text-sport-fg mb-2">{t('successTitle')}</h2>
              <p className="text-sport-gray text-sm mb-6">
                {t('successDesc')}
              </p>
              <Button asChild>
                <Link href="/">{t('backHome')} <ArrowRight size={14} /></Link>
              </Button>
            </Card>
          ) : (
            <Card className="p-8 hover:-translate-y-0 hover:shadow-sm">
              <h2 className="text-lg font-black text-sport-fg mb-6">{t('formTitle')}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="uppercase tracking-wider">{t('nameLabel')}</Label>
                    <Input
                      type="text"
                      required
                      value={form.name}
                      onChange={set('name')}
                      placeholder={t('namePlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="uppercase tracking-wider">{t('emailLabel')}</Label>
                    <Input
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      placeholder={t('emailPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <Label className="uppercase tracking-wider">{t('subjectLabel')}</Label>
                  <Select value={form.subject} onChange={set('subject')}>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>

                <div>
                  <Label className="uppercase tracking-wider">{t('messageLabel')}</Label>
                  <Textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={set('message')}
                    placeholder={t('messagePlaceholder')}
                    className="resize-none"
                  />
                </div>

                {error && <Alert variant="error">{error}</Alert>}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading
                    ? <><Loader size={16} className="text-white" iconClassName="text-white" />{t('sending')}</>
                    : <>{t('send')} <ArrowRight size={14} /></>
                  }
                </Button>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactForm />
    </Suspense>
  )
}
