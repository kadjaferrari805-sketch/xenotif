export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sport-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-sport-border" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-sport-orange" />
        </div>
        <p className="text-sm font-semibold text-sport-gray">Chargement...</p>
      </div>
    </div>
  )
}
