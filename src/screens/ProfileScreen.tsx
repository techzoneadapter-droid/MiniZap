export function ProfileScreen() {
  return (
    <main className="screen profile-screen-premium">
      <section className="profile-card">
        <div className="avatar premium-avatar"><img src="/art/zapling-hero.svg" alt="" /></div>
        <h1>Zap Hero</h1>
        <p>Level 12 · Puzzle Raider</p>
        <div className="rank-chip"><img src="/art/league-shield.svg" alt="" /> Gold League</div>
      </section>
      <section className="stats-grid">
        <div><img src="/art/nav-rewards.svg" alt="" /><strong>7</strong><small>Best streak</small></div>
        <div><img src="/art/resource-coin.svg" alt="" /><strong>86</strong><small>Levels won</small></div>
        <div><img src="/art/nav-games.svg" alt="" /><strong>74%</strong><small>Win rate</small></div>
        <div><img src="/art/resource-gem.svg" alt="" /><strong>8.2K</strong><small>Coins earned</small></div>
      </section>
      <section className="settings-card">
        <button>Sound & Haptics <span>›</span></button>
        <button>Game Preferences <span>›</span></button>
        <button>Privacy & Data <span>›</span></button>
        <button>About MiniZap <span>›</span></button>
      </section>
    </main>
  )
}
