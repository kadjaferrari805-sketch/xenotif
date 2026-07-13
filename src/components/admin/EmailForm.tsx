'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

export function AdminEmailForm() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState<'all' | 'active' | 'trialing'>('all')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number } | null>(null)

  async function send() {
    if (!subject.trim() || !message.trim()) return
    setSending(true)
    setResult(null)
    const res = await fetch('/api/admin/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message, target }),
    })
    const data = await res.json()
    setResult(data)
    setSending(false)
    if (data.sent > 0) {
      setSubject('')
      setMessage('')
    }
  }

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl mt-10">
      <div className="px-6 py-4 border-b border-sport-border flex items-center gap-3">
        <Send size={16} className="text-sport-orange" />
        <h2 className="text-sm font-black text-sport-fg">Envoyer un email</h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">Destinataires</label>
            <select
              value={target}
              onChange={e => setTarget(e.target.value as typeof target)}
              className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-sport-fg text-sm focus:outline-none focus:border-sport-orange"
            >
              <option value="all">Tous les utilisateurs</option>
              <option value="active">Abonnés actifs seulement</option>
              <option value="trialing">En essai gratuit seulement</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">Sujet</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Objet de l'email"
              className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-sport-fg text-sm focus:outline-none focus:border-sport-orange placeholder:text-sport-gray"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">Message</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Contenu de l'email (une ligne = un paragraphe)"
            rows={5}
            className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-sport-fg text-sm focus:outline-none focus:border-sport-orange placeholder:text-sport-gray resize-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={send}
            disabled={sending || !subject.trim() || !message.trim()}
            className="inline-flex items-center gap-2 bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 disabled:opacity-60 transition-all"
          >
            {sending ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Envoi…</> : <><Send size={14} />Envoyer</>}
          </button>
          {result && (
            <p className="text-[#1E7F5A] text-sm font-semibold flex items-center gap-1.5">
              <CheckCircle size={14} /> {result.sent} email{result.sent > 1 ? 's' : ''} envoyé{result.sent > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
