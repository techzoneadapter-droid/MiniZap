export function SectionTitle({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow?: string
  title: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <span>{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {action && (
        <button onClick={onAction}>
          {action} <span aria-hidden="true">›</span>
        </button>
      )}
    </div>
  )
}
