// Skeleton instantané affiché pendant le rendu serveur de « Mon espace ».
export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 animate-pulse" aria-hidden="true">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 w-64 max-w-full rounded-lg bg-sport-card" />
        <div className="h-4 w-44 rounded bg-sport-card mt-3" />
      </div>

      {/* Carte abonnement / anneaux */}
      <div className="h-40 rounded-2xl bg-sport-card border border-sport-border mb-6" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-sport-card border border-sport-border" />
        ))}
      </div>

      {/* Programmes */}
      <div className="h-5 w-40 rounded bg-sport-card mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-sport-card border border-sport-border" />
        ))}
      </div>

      {/* Activité récente */}
      <div className="h-5 w-36 rounded bg-sport-card mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-sport-card border border-sport-border" />
        ))}
      </div>
    </div>
  )
}
