interface TopBarProps {
  coins: number
  gems: number
  level: number
  xp: number
}

export function TopBar({ coins, gems, level, xp }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="player-badge">
        <div className="shield"><span>{level}</span></div>
        <div className="level-copy">
          <strong>Zap Hero</strong>
          <div className="xp-track"><span style={{ width: `${xp}%` }} /></div>
        </div>
      </div>
      <div className="currency-row">
        <div className="currency-pill coin"><span>●</span><b>{coins.toLocaleString()}</b><button>+</button></div>
        <div className="currency-pill gem"><span>◆</span><b>{gems}</b><button>+</button></div>
      </div>
    </header>
  )
}
