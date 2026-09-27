import { GameIcon } from '../components/GameIcon'
import { ArenaArt } from '../components/ArenaArt'
import type { CSSProperties } from 'react'
import type { MiniGame } from '../types/game'

export function GameDetailScreen({
  game,
  onBack,
  onComplete,
}: {
  game: MiniGame
  onBack: () => void
  onComplete: () => void
}) {
  return (
    <main
      className="game-detail"
      style={
        { '--game-a': game.accent, '--game-b': game.accent2 } as CSSProperties
      }
    >
      <button
        className="back-button"
        aria-label="Back to kingdom"
        onClick={onBack}
      >
        ‹
      </button>
      <div className={`detail-art game-art-${game.id}`}>
        <ArenaArt id={game.id} />
        <i />
        <i />
        <i />
      </div>
      <div className="detail-sheet">
        <span className="detail-kicker">MINIZAP CHALLENGE</span>
        <h1>{game.name}</h1>
        <p>
          {game.subtitle}. Visit the training camp for a quick demo and a taste
          of your next adventure.
        </p>
        <div className="detail-stats">
          <div>
            <small>LEVELS</small>
            <b>{game.levels}</b>
          </div>
          <div>
            <small>BEST</small>
            <b>{game.bestScore}</b>
          </div>
          <div>
            <small>MODE</small>
            <b>{game.difficulty}</b>
          </div>
        </div>
        <div className="level-preview">
          <span>01</span>
          <div>
            <strong>Training Camp</strong>
            <small>Practice your first move</small>
          </div>
          <div className="stars" aria-label="2 of 3 stars">
            <GameIcon name="star" />
            <GameIcon name="star" />
            <GameIcon name="star" className="unearned" />
          </div>
        </div>
        <button className="primary-cta wide" onClick={onComplete}>
          PLAY DEMO{' '}
          <span>
            <GameIcon name="play" />
          </span>
        </button>
        <button className="secondary-cta" onClick={onBack}>
          Back to village
        </button>
      </div>
    </main>
  )
}
