import { games } from '../data/games'
import type { MiniGame } from '../types/game'
import { SectionTitle } from '../components/SectionTitle'

export function HomeScreen({ onPlay }: { onPlay: (game: MiniGame) => void }) {
  const arrow = games[0]
  const tapAway = games[1]
  const parking = games[2]
  const colorSort = games[3]

  return (
    <main className="screen home-screen world-home">
      <section className="kingdom-hub">
        <div className="kingdom-heading">
          <span>⚔ MINI ZAP KINGDOM</span>
          <h1>Choose your arena</h1>
        </div>

        <img className="kingdom-art" src="/art/village-hub.svg" alt="" />

        <button className="world-node node-left" onClick={() => onPlay(arrow)}>
          <span className="node-icon">➹</span>
          <div><small>ARENA 01</small><b>Arrow Escape</b></div>
        </button>

        <button className="world-node node-center" onClick={() => onPlay(games[4])}>
          <span className="node-icon">♛</span>
          <div><small>DAILY QUEST</small><b>Lightning Trial</b></div>
        </button>

        <button className="world-node node-right" onClick={() => onPlay(tapAway)}>
          <span className="node-icon">✦</span>
          <div><small>ARENA 02</small><b>Tap Away</b></div>
        </button>

        <div className="map-badge">
          <span>🔥</span>
          <div><small>STREAK</small><b>7 DAYS</b></div>
        </div>
      </section>

      <section className="kingdom-status">
        <button className="league-panel">
          <img src="/art/league-shield.svg" alt="" />
          <div><small>WEEKLY LEAGUE</small><strong>Gold Arena</strong><span>Top 18% · 1,240 pts</span></div>
          <b className="panel-chevron">›</b>
        </button>

        <button className="chest-panel">
          <img src="/art/treasure-chest.svg" alt="" />
          <div><small>NEXT TREASURE</small><strong>2 wins left</strong><span>Rare chest waiting</span></div>
          <b className="panel-chevron">›</b>
        </button>
      </section>

      <SectionTitle eyebrow="QUICK PLAY" title="Battle grounds" action="All games" />

      <section className="battle-grid">
        {[arrow, tapAway, parking, colorSort].map((game, index) => (
          <button
            className={`battle-tile tile-${index + 1}`}
            key={game.id}
            onClick={() => onPlay(game)}
          >
            <span className="tile-glow" />
            <span className="tile-rank">{index + 1}</span>
            <div className="tile-icon">{game.icon}</div>
            <div className="tile-copy">
              <small>{game.difficulty.toUpperCase()}</small>
              <b>{game.name}</b>
              <span>{game.levels} levels</span>
            </div>
            <span className="tile-play">▶</span>
          </button>
        ))}
      </section>

      <section className="quest-banner" onClick={() => onPlay(games[4])}>
        <div className="quest-emblem">⚡</div>
        <div>
          <small>LIMITED DAILY TRIAL</small>
          <strong>Beat 850 points in 45 sec</strong>
          <span>Reward: 350 coins + treasure progress</span>
        </div>
        <button>PLAY</button>
      </section>
    </main>
  )
}
