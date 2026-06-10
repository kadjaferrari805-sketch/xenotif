interface SectionHeaderProps {
  label: string
  title: string
  subtitle?: string
  id?: string
  size?: 'default' | 'lg'
}

export function SectionHeader({ label, title, subtitle, id, size = 'default' }: SectionHeaderProps) {
  return (
    <div className="text-center">
      <p className={`section-label mb-3${size === 'lg' ? ' text-lg! md:text-2xl!' : ''}`}>{label}</p>
      <h2 id={id} className="section-title text-3d mb-3">{title}</h2>
      {subtitle && <p className="section-sub max-w-xl mx-auto">{subtitle}</p>}
    </div>
  )
}
