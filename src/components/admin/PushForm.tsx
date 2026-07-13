'use client'

import { useState } from 'react'
import { Bell, CheckCircle } from 'lucide-react'

export function AdminPushForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [url, setUrl] = useState('')
  const [target, setTarget] = useState<'all' | 'active' | 'trialing'>('all')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; recipients: number } | null>(null)

  async function send() {
    if (!title.trim() || !body.trim()) return
    setSending(true)
    setResult(null)
    const res = await fetch('/api/admin/send-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, url: url.trim() || undefined, target }),
    })
    const data = await res.json()
    setResult(data)
    setSending(false)
    if (data.recipients > 0) {
      setTitle('')
      setBody('')
      setUrl('')
    }
  }

  return (
    <div className="bg-sport-card border border-sport-border rounded-2xl mt-10">
      <div className="px-6 py-4 border-b border-sport-border flex items-center gap-3">
        <Bell size={16} className="text-sport-orange" />
        <h2 className="text-sm font-black text-sport-fg">Envoyer une notification push</h2>
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
            <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">Titre</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Titre de la notification"
              className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-sport-fg text-sm focus:outline-none focus:border-sport-orange placeholder:text-sport-gray"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">Message</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Contenu de la notification (court)"
            rows={3}
            className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-sport-fg text-sm focus:outline-none focus:border-sport-orange placeholder:text-sport-gray resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-sport-fg mb-2 uppercase tracking-wider">Lien (optionnel)</label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="/dashboard/notifications"
            className="w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-sport-fg text-sm focus:outline-none focus:border-sport-orange placeholder:text-sport-gray"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={send}
            disabled={sending || !title.trim() || !body.trim()}
            className="inline-flex items-center gap-2 bg-sport-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 disabled:opacity-60 transition-all"
          >
            {sending ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Envoi…</> : <><Bell size={14} />Envoyer</>}
          </button>
          {result && (
            <p className="text-[#1E7F5A] text-sm font-semibold flex items-center gap-1.5">
              <CheckCircle size={14} /> {result.recipients} destinataire{result.recipients > 1 ? 's' : ''} · {result.sent} appareil{result.sent > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
