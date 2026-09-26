import { games } from '../data/games'
import type { MiniGame } from '../types/game'
import { GameCard } from '../components/GameCard'
import { SectionTitle } from '../components/SectionTitle'

export function HomeScreen({ onPlay }: { onPlay: (game: MiniGame) => void }) {
  const featured = games[0]

  return (
    <main className="screen home-screen">
      <section className="hero-panel">
        <div className="hero-sun" />
        <div className="hero-cloud cloud-1" />
        <div className="hero-cloud cloud-2" />
        <div className="hero-mountain mountain-a" />
        <div className="hero-mountain mountain-b" />
        <div className="hero-grass grass-a" />
        <div className="hero-grass grass-b" />

        <div className="hero-copy">
          <span className="eyebrow-chip">⚔ DAILY QUEST</span>
          <h1>Small games.<br/><em>Big streaks.</em></h1>
          <p>Beat today's challenge and grab the golden chest before the timer ends.</p>
          <button className="primary-cta hero-play" onClick={() => onPlay(featured)}>
            <span className="button-shine" />
            PLAY NOW <span>▶</span>
          </button>
        </div>

        <div className="hero-tower">
          <div className="tower-aura" />
          <div className="flag">⚡</div>
          <div className="roof" />
          <div className="tower-window" />
          <div className="tower-base" />
          <div className="tower-rock rock-a" />
          <div className="tower-rock rock-b" />
        </div>

        <div className="hero-ribbon">
          <span>★ FEATURED</span>
          <b>Arrow Escape</b>
        </div>
      </section>

      <section className="streak-strip">
        <div className="streak-icon">🔥</div>
        <div><small>DAILY STREAK</small><strong>7 days</strong></div>
        <div className="streak-days">{['M','T','W','T','F','S','S'].map((d,i)=><span key={`${d}-${i}`} className={i<6?'done':i===6?'today':''}>{i<6?'✓':d}</span>)}</div>
      </section>

      <section className="home-event-row">
        <button className="event-card purple">
          <span className="event-icon">♛</span>
          <div><small>WEEKLY LEAGUE</small><b>Gold Arena</b><em>Top 18%</em></div>
        </button>
        <button className="event-card gold">
          <span className="event-icon">✦</span>
          <div><small>NEXT CHEST</small><b>2 wins left</b><em>Rare reward</em></div>
        </button>
      </section>

      <SectionTitle eyebrow="QUICK PLAY" title="Pick your challenge" action="See all" />
      <div className="game-list">{games.slice(0,4).map(game => <GameCard key={game.id} game={game} onPlay={onPlay} />)}</div>

      <SectionTitle eyebrow="TODAY" title="Daily Challenge" />
      <button className="daily-card" onClick={() => onPlay(games[4])}>
        <div className="daily-glow" />
        <div className="daily-crown">♛</div>
        <div><strong>Lightning Reflex</strong><span>Reach 850 points in 45 seconds</span><div className="reward-line"><b>+350</b> coins <b>+1</b> chest</div></div>
        <div className="daily-arrow">›</div>
      </button>
    </main>
  )
}
