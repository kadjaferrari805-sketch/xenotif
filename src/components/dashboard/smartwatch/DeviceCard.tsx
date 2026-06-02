'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { CheckCircle2, Loader2, Plug, Unplug, RefreshCw, Clock } from 'lucide-react'
import type { WatchProviderMeta, SmartWatchConnection } from '@/lib/smartwatch/types'

interface DeviceCardProps {
  provider: WatchProviderMeta
  connection?: SmartWatchConnection
  onConnect: (providerId: string) => Promise<void>
  onDisconnect: (providerId: string) => Promise<void>
  onSync: (providerId: string) => Promise<void>
}

export function DeviceCard({ provider, connection, onConnect, onDisconnect, onSync }: DeviceCardProps) {
  const t = useTranslations('dashboard.smartwatch.device')
  const locale = useLocale()
  const [loading, setLoading] = useState<'connect' | 'sync' | 'disconnect' | null>(null)
  const isConnected = !!connection?.is_active

  const lastSync = connection?.last_sync_at
    ? new Date(connection.last_sync_at).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : null

  async function handleConnect() {
    setLoading('connect')
    try { await onConnect(provider.id) }
    finally { setLoading(null) }
  }

  async function handleSync() {
    setLoading('sync')
    try { await onSync(provider.id) }
    finally { setLoading(null) }
  }

  async function handleDisconnect() {
    setLoading('disconnect')
    try { await onDisconnect(provider.id) }
    finally { setLoading(null) }
  }

  return (
    <div
      className="relative rounded-2xl border transition-all duration-300 p-5 overflow-hidden group"
      style={{
        background: isConnected ? `${provider.color}08` : '#111318',
        borderColor: isConnected ? `${provider.color}40` : '#1E2028',
      }}
    >
      {/* Glow when connected */}
      {isConnected && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${provider.color}12 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Connected badge */}
      {isConnected && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2.5 py-1">
          <CheckCircle2 size={10} className="text-emerald-400" />
          <span className="text-[10px] text-emerald-400 font-bold">{t('connected')}</span>
        </div>
      )}

      {provider.comingSoon && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
          <Clock size={9} className="text-sport-gray" />
          <span className="text-[10px] text-sport-gray font-bold">{t('comingSoon')}</span>
        </div>
      )}

      {/* Logo & name */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `${provider.color}15`, border: `1px solid ${provider.color}30` }}
        >
          {provider.logo}
        </div>
        <div>
          <p className="text-sm font-black text-white">{provider.name}</p>
          <p className="text-[11px] text-sport-gray">{provider.comingSoon ? t('comingSoonDesc') : provider.description}</p>
        </div>
      </div>

      {/* Last sync */}
      {lastSync && (
        <p className="text-[10px] text-sport-gray mb-3 flex items-center gap-1">
          <RefreshCw size={9} />
          {t('syncedOn', { date: lastSync })}
        </p>
      )}

      {/* Actions */}
      {!provider.comingSoon && (
        <div className="flex gap-2">
          {isConnected ? (
            <>
              <button
                onClick={handleSync}
                disabled={loading !== null}
                className="flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2 px-3 rounded-xl transition-all"
                style={{ background: `${provider.color}20`, color: provider.color, border: `1px solid ${provider.color}30` }}
              >
                {loading === 'sync' ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                {t('sync')}
              </button>
              <button
                onClick={handleDisconnect}
                disabled={loading !== null}
                className="flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
              >
                {loading === 'disconnect' ? <Loader2 size={12} className="animate-spin" /> : <Unplug size={12} />}
              </button>
            </>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl transition-all hover:opacity-90"
              style={{ background: `${provider.color}20`, color: provider.color, border: `1px solid ${provider.color}40` }}
            >
              {loading === 'connect' ? <Loader2 size={12} className="animate-spin" /> : <Plug size={12} />}
              {t('connect')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
