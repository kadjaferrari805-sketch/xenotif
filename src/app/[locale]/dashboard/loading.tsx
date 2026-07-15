import { Skeleton } from '@/components/ui/Skeleton'

// Skeleton instantané affiché pendant le rendu serveur de « Mon espace ».
export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8" aria-hidden="true">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 max-w-full rounded-lg" />
        <Skeleton className="h-4 w-44 rounded mt-3" />
      </div>

      {/* Carte abonnement / anneaux */}
      <Skeleton className="h-40 rounded-2xl border border-sport-border mb-6" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl border border-sport-border" />
        ))}
      </div>

      {/* Programmes */}
      <Skeleton className="h-5 w-40 rounded mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl border border-sport-border" />
        ))}
      </div>

      {/* Activité récente */}
      <Skeleton className="h-5 w-36 rounded mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl border border-sport-border" />
        ))}
      </div>
    </div>
  )
}
