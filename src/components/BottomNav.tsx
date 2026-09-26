export type TabId = 'home' | 'games' | 'rewards' | 'profile'

interface BottomNavProps {
  active: TabId
  onChange: (tab: TabId) => void
}

const items: { id: TabId; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'games', label: 'Games', icon: '▦' },
  { id: 'rewards', label: 'Rewards', icon: '★' },
  { id: 'profile', label: 'Profile', icon: '♟' },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => onChange(item.id)}>
          <span>{item.icon}</span><small>{item.label}</small>
        </button>
      ))}
    </nav>
  )
}
