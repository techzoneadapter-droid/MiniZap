import { games } from '../data/games'
import type { MiniGame } from '../types/game'
import type { TabId } from '../components/BottomNav'
import { ArenaArt } from '../components/ArenaArt'

export function HomeScreen({
  onPlay,
  onNavigate,
}: {
  onPlay: (game: MiniGame) => void
  onNavigate: (tab: TabId) => void
}) {
  return (
    <main className="screen world-home kingdom-v2">
      <section className="kingdom-hub" aria-label="MiniZap kingdom map">
        <img className="kingdom-art" src="/art/village-hub.svg" alt="" />
        <div className="kingdom-cloud cloud-one" aria-hidden="true" />
        <div className="kingdom-cloud cloud-two" aria-hidden="true" />
        <div className="kingdom-heading">
          <span>WELCOME BACK, HERO</span>
          <h1>MiniZap Kingdom</h1>
        </div>
        <div className="map-badge">
          <b>7</b>
          <span>DAY<br />STREAK</span>
        </div>
        <div className="kingdom-path path-one" aria-hidden="true" />
        <div className="kingdom-path path-two" aria-hidden="true" />
        {games.slice(0, 4).map((game, index) => (
          <button
            className={`world-node node-${index}`}
            key={game.id}
            onClick={() => onPlay(game)}
          >
            <ArenaArt id={game.id} />
            <span className="node-label">
              <small>{index === 0 ? 'READY' : `ARENA ${index + 1}`}</small>
              <b>{game.name}</b>
            </span>
            {index === 0 && <span className="node-ready">PLAY</span>}
          </button>
        ))}
        <div className="mascot-speech">Pick an arena!</div>
        <img
          className="kingdom-mascot"
          src="/art/zapling-hero.svg"
          alt="Zap, your kingdom guide"
        />
        <button className="map-quest" onClick={() => onPlay(games[4])}>
          <span>!</span>
          <div>
            <small>DAILY QUEST · +150</small>
            <b>Lightning Trial</b>
          </div>
          <b>›</b>
        </button>
        <div className="kingdom-foreground" aria-hidden="true">
          <span className="bush bush-a" /><span className="bush bush-b" />
          <span className="rock rock-a" /><span className="rock rock-b" />
          <span className="flower flower-a" /><span className="flower flower-b" />
        </div>
      </section>
      <section className="kingdom-status" aria-label="Kingdom progress">
        <button className="league-panel" onClick={() => onNavigate('profile')}>
          <img src="/art/league-shield.svg" alt="" />
          <div><small>GOLD LEAGUE</small><strong>1,240</strong><span>View hero hall</span></div>
          <b>›</b>
        </button>
        <button className="chest-panel" onClick={() => onNavigate('rewards')}>
          <img src="/art/treasure-chest.svg" alt="" />
          <div><small>RARE CHEST</small><strong>2 wins</strong><span>View treasure</span></div>
          <b>›</b>
        </button>
      </section>
      <button className="all-arenas-button" onClick={() => onNavigate('games')}>
        <span>Adventure atlas</span><b>Explore all 6 arenas</b><i>›</i>
      </button>
    </main>
  )
}
