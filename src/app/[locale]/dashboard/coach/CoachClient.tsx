'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Send, Zap, Bot, User, Sparkles, RefreshCw } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

export function CoachClient() {
  const t = useTranslations('dashboard.coach')
  const suggestions = t.raw('suggestions') as string[]
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text: string) {
    if (!text.trim() || streaming) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setStreaming(true)

    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages([...next, assistantMsg])

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      // Toute réponse non-200 (free user 403, rate-limit 429, API 502…) porte un
      // corps de texte d'erreur : sans ce garde, il serait streamé comme une réponse
      // du coach. On bascule plutôt sur le message d'erreur convivial (catch).
      if (!res.ok || !res.body) throw new Error('Coach request failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      const chunks: string[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(decoder.decode(value, { stream: true }))
        const content = chunks.join('')
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content }
          return updated
        })
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: t('error'),
        }
        return updated
      })
    }

    setStreaming(false)
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh)] pb-16 md:pb-0">

      {/* Header */}
      <div className="shrink-0 px-6 py-5 border-b border-sport-border bg-sport-dark flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center">
            <Bot size={18} className="text-sport-orange" />
          </div>
          <div>
            <h1 className="text-base font-black text-sport-fg flex items-center gap-2">
              {t('title')}
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-[#1E7F5A] border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t('online')}
              </span>
            </h1>
            <p className="text-[11px] text-sport-gray">{t('poweredBy')}</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="inline-flex items-center gap-1.5 text-xs text-sport-gray hover:text-sport-fg transition-colors"
          >
            <RefreshCw size={12} />
            {t('newSession')}
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 rounded-2xl bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center mb-6">
              <Sparkles size={32} className="text-sport-orange" />
            </div>
            <h2 className="text-xl font-black text-sport-fg mb-2">{t('emptyTitle')}</h2>
            <p className="text-sport-gray text-sm max-w-sm mb-8">
              {t('emptySubtitle')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left px-4 py-3 bg-sport-card border border-sport-border rounded-xl text-xs text-sport-gray hover:text-sport-fg hover:border-sport-orange/50 transition-all hover:-translate-y-0.5 leading-relaxed"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} className="text-sport-orange" />
                  </div>
                )}
                <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-sport-orange text-white rounded-br-sm'
                    : 'bg-sport-card border border-sport-border text-sport-fg rounded-bl-sm'
                }`}>
                  {msg.role === 'assistant' && !msg.content && streaming ? (
                    <span className="inline-flex gap-1 items-center text-sport-gray">
                      <span className="w-1.5 h-1.5 rounded-full bg-sport-gray animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-sport-gray animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-sport-gray animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-sport-fg/10 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} className="text-sport-fg" />
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 md:px-8 py-4 border-t border-sport-border bg-sport-dark">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('placeholder')}
              disabled={streaming}
              className="w-full bg-sport-card border border-sport-border rounded-2xl px-4 py-3 pr-12 text-sport-fg text-sm placeholder:text-sport-gray focus:outline-none focus:border-sport-orange transition-colors resize-none leading-relaxed disabled:opacity-60"
              style={{ maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || streaming}
            aria-label={t('send')}
            className="w-11 h-11 bg-sport-orange rounded-2xl flex items-center justify-center hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-40 shrink-0"
          >
            {streaming
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <Send size={16} className="text-sport-fg" />
            }
          </button>
        </div>
        <p className="text-center text-[10px] text-sport-gray mt-2 flex items-center justify-center gap-1">
          <Zap size={10} className="text-sport-orange" />
          {t('disclaimer')}
        </p>
      </div>
    </div>
  )
}
