import { GameIcon } from '../components/GameIcon'
import { games } from '../data/games'
import { loadProgress } from '../games/gameUtils'
export function ProfileScreen() {
  const progress = games.map((game) => loadProgress(game.id))
  const levelsWon = progress.reduce((total, game) => total + Object.keys(game.stars).length, 0)
  const stars = progress.reduce((total, game) => total + Object.values(game.stars).reduce((sum, value) => sum + value, 0), 0)
  const bestStreak = Math.max(0, ...progress.map((game) => game.bestStreak))
  return (
    <main className="screen profile-screen-premium">
      <div className="destination-heading">
        <span>LEGENDS START SMALL</span>
        <h1>Hero hall</h1>
        <p>Your story is just getting started.</p>
      </div>
      <section className="profile-card">
        <div className="hero-banner banner-left" aria-hidden="true">
          <GameIcon name="star" />
        </div>
        <div className="hero-banner banner-right" aria-hidden="true">
          <GameIcon name="star" />
        </div>
        <div className="avatar premium-avatar">
          <img src="/art/zapling-hero.svg" alt="" />
        </div>
        <h2>Zap Hero</h2>
        <p>Level 12 · Puzzle Raider</p>
        <div className="rank-chip">
          <img src="/art/league-shield.svg" alt="" /> Gold League
        </div>
      </section>
      <div className="section-title">
        <div>
          <span>A RECORD OF YOUR ADVENTURES</span>
          <h2>Glory & milestones</h2>
        </div>
      </div>
      <section className="stats-grid">
        <div>
          <img src="/art/nav-rewards.svg" alt="" />
          <strong>{bestStreak}</strong>
          <small>Best streak</small>
        </div>
        <div>
          <img src="/art/resource-coin.svg" alt="" />
          <strong>{levelsWon}</strong>
          <small>Levels won</small>
        </div>
        <div>
          <img src="/art/nav-games.svg" alt="" />
          <strong>{stars}</strong>
          <small>Stars earned</small>
        </div>
        <div>
          <img src="/art/resource-coin.svg" alt="" />
          <strong>8.2K</strong>
          <small>Coins earned</small>
        </div>
      </section>
      <section className="settings-card">
        <button>
          Sound & Haptics <span>›</span>
        </button>
        <button>
          Game Preferences <span>›</span>
        </button>
        <button>
          Privacy & Data <span>›</span>
        </button>
        <button>
          About MiniZap <span>›</span>
        </button>
      </section>
    </main>
  )
}
