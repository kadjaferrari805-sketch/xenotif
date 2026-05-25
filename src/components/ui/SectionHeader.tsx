interface SectionHeaderProps {
  label: string
  title: string
  subtitle?: string
  id?: string
}

export function SectionHeader({ label, title, subtitle, id }: SectionHeaderProps) {
  return (
    <div className="text-center">
      <p className="section-label mb-3">{label}</p>
      <h2 id={id} className="section-title mb-3">{title}</h2>
      {subtitle && <p className="section-sub max-w-xl mx-auto">{subtitle}</p>}
    </div>
  )
}
