import { GameIcon } from './GameIcon'
import { ArenaArt } from './ArenaArt'
import type { CSSProperties } from 'react'
import type { MiniGame } from '../types/game'

export function GameCard({
  game,
  onPlay,
}: {
  game: MiniGame
  onPlay: (game: MiniGame) => void
}) {
  return (
    <button
      className="game-card"
      onClick={() => onPlay(game)}
      style={
        { '--game-a': game.accent, '--game-b': game.accent2 } as CSSProperties
      }
    >
      <span className="card-rivet rivet-a" />
      <span className="card-rivet rivet-b" />
      {game.badge && <span className="game-badge">{game.badge}</span>}
      <div className={`game-art game-art-${game.id}`}>
        <span className="art-shine" />
        <ArenaArt id={game.id} />
        <span className="spark spark-a" />
        <span className="spark spark-b" />
        <span className="spark spark-c" />
      </div>
      <div className="game-copy">
        <h3>{game.name}</h3>
        <p>{game.subtitle}</p>
        <div className="game-meta">
          <span>{game.levels} levels</span>
          <span>{game.difficulty}</span>
        </div>
      </div>
      <span className="play-orb">
        <i>
          <GameIcon name="play" />
        </i>
      </span>
    </button>
  )
}
