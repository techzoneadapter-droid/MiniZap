export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: string }) {
  return (
    <div className="section-title">
      <div>{eyebrow && <span>{eyebrow}</span>}<h2>{title}</h2></div>
      {action && <button>{action}</button>}
    </div>
  )
}
