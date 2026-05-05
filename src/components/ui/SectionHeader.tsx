interface SectionHeaderProps {
  label: string
  title: string
  subtitle?: string
}

export function SectionHeader({ label, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="text-center mb-10">
      <p className="section-label mb-2">{label}</p>
      <h2 className="section-title mb-2">{title}</h2>
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </div>
  )
}
