import { GameIcon } from '../components/GameIcon'
import { games } from '../data/games'
import type { MiniGame } from '../types/game'
import type { TabId } from '../components/BottomNav'
import { SectionTitle } from '../components/SectionTitle'
import { ArenaArt } from '../components/ArenaArt'

export function HomeScreen({
  onPlay,
  onNavigate,
}: {
  onPlay: (game: MiniGame) => void
  onNavigate: (tab: TabId) => void
}) {
  return (
    <main className="screen world-home">
      <section className="kingdom-hub" aria-label="MiniZap kingdom map">
        <img className="kingdom-art" src="/art/kingdom-landscape.svg" alt="" />
        <div className="kingdom-heading">
          <span>YOUR TINY WORLD. BIG ADVENTURES.</span>
          <h1>MiniZap Kingdom</h1>
          <p>A little magic. A brilliant escape.</p>
        </div>
        <div className="map-badge">
          <b>7</b>
          <span>DAY STREAK</span>
        </div>
        {games.slice(0, 4).map((game, index) => (
          <button
            className={`world-node node-${index}`}
            key={game.id}
            onClick={() => onPlay(game)}
          >
            <ArenaArt id={game.id} />
            <span className="node-label">
              <small>ARENA 0{index + 1}</small>
              <b>{game.name}</b>
            </span>
            {index === 0 && <span className="node-ready">PLAY</span>}
          </button>
        ))}
        <img
          className="kingdom-mascot"
          src="/art/zapling-hero.svg"
          alt="Zap, your kingdom guide"
        />
        <button className="map-quest" onClick={() => onPlay(games[4])}>
          <span>!</span>
          <div>
            <small>DAILY QUEST</small>
            <b>Lightning Trial</b>
          </div>
          <b>›</b>
        </button>
      </section>
      <section className="kingdom-status" aria-label="Kingdom progress">
        <button className="league-panel" onClick={() => onNavigate('profile')}>
          <img src="/art/league-shield.svg" alt="" />
          <div>
            <small>YOUR LEAGUE</small>
            <strong>Gold Arena</strong>
            <span>1,240 points</span>
          </div>
          <b>›</b>
        </button>
        <button className="chest-panel" onClick={() => onNavigate('rewards')}>
          <img src="/art/treasure-chest.svg" alt="" />
          <div>
            <small>TREASURE TRAIL</small>
            <strong>2 wins away</strong>
            <span>A rare reward awaits</span>
          </div>
          <b>›</b>
        </button>
      </section>
      <SectionTitle
        eyebrow="PICK YOUR NEXT ADVENTURE"
        title="Battle grounds"
        action="View all"
        onAction={() => onNavigate('games')}
      />
      <section className="battle-grid">
        {games.slice(0, 4).map((game, index) => (
          <button
            className={`battle-tile tile-${index}`}
            key={game.id}
            onClick={() => onPlay(game)}
          >
            <span className="tile-rank">0{index + 1}</span>
            <ArenaArt className="tile-arena-art" id={game.id} />
            <div className="tile-copy">
              <small>
                {game.difficulty} · {game.levels} levels
              </small>
              <b>{game.name}</b>
            </div>
            <span className="tile-play">
              <GameIcon name="play" />
            </span>
          </button>
        ))}
      </section>
      <section className="quest-banner">
        <img src="/art/arena-reaction.svg" alt="" />
        <div>
          <small>THE DAILY CHALLENGE</small>
          <strong>Make every second count</strong>
          <span>Lightning Trial · 45 seconds</span>
        </div>
        <button
          onClick={() => onPlay(games[4])}
          aria-label="Play Lightning Trial"
        >
          <GameIcon name="play" />
        </button>
      </section>
    </main>
  )
}
