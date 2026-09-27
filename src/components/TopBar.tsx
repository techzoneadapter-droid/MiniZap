interface TopBarProps {
  coins: number
  gems: number
  level: number
  xp: number
}

export function TopBar({ coins, gems, level, xp }: TopBarProps) {
  return (
    <header className="topbar premium-topbar">
      <div className="player-badge premium-player">
        <div className="portrait-wrap">
          <img src="/art/zapling-hero.svg" alt="" />
          <span className="portrait-level">{level}</span>
        </div>
        <div className="level-copy">
          <strong>Zap Hero</strong>
          <div className="xp-track">
            <span style={{ width: `${xp}%` }} />
          </div>
          <small>{xp}% to level {level + 1}</small>
        </div>
      </div>
      <div className="currency-row premium-currency-row">
        <div className="currency-pill coin">
          <img src="/art/resource-coin.svg" alt="Coins" />
          <b>{coins.toLocaleString()}</b>
          <span className="resource-plus" aria-hidden="true">
            +
          </span>
        </div>
        <div className="currency-pill gem">
          <img src="/art/resource-gem.svg" alt="Gems" />
          <b>{gems}</b>
          <span className="resource-plus" aria-hidden="true">
            +
          </span>
        </div>
      </div>
    </header>
  )
}
