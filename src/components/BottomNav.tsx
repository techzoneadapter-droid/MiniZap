export type TabId = 'home' | 'games' | 'rewards' | 'profile'

interface BottomNavProps {
  active: TabId
  onChange: (tab: TabId) => void
}

const items: { id: TabId; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '/art/nav-home.svg' },
  { id: 'games', label: 'Games', icon: '/art/nav-games.svg' },
  { id: 'rewards', label: 'Rewards', icon: '/art/treasure-chest.svg' },
  { id: 'profile', label: 'Profile', icon: '/art/zapling-hero.svg' },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav aria-label="Main navigation" className="bottom-nav premium-nav">
      {items.map((item) => (
        <button
          aria-current={active === item.id ? 'page' : undefined}
          key={item.id}
          className={active === item.id ? 'active' : ''}
          onClick={() => onChange(item.id)}
        >
          <span className="nav-icon-shell">
            <img src={item.icon} alt="" />
          </span>
          <small>{item.label}</small>
        </button>
      ))}
    </nav>
  )
}
