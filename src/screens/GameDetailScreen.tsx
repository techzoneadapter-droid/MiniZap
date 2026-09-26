import type { CSSProperties } from 'react'
import type { MiniGame } from '../types/game'

export function GameDetailScreen({ game, onBack, onComplete }: { game: MiniGame; onBack: () => void; onComplete: () => void }) {
  return <main className="game-detail" style={{ '--game-a': game.accent, '--game-b': game.accent2 } as CSSProperties}>
    <button className="back-button" onClick={onBack}>‹</button>
    <div className={`detail-art game-art-${game.id}`}><span>{game.icon}</span><i/><i/><i/></div>
    <div className="detail-sheet">
      <span className="detail-kicker">MINIZAP CHALLENGE</span>
      <h1>{game.name}</h1>
      <p>{game.subtitle}. This is the production-ready game shell; gameplay logic can be added independently without rebuilding navigation or monetization structure.</p>
      <div className="detail-stats"><div><small>LEVELS</small><b>{game.levels}</b></div><div><small>BEST</small><b>{game.bestScore}</b></div><div><small>MODE</small><b>{game.difficulty}</b></div></div>
      <div className="level-preview"><span>01</span><div><strong>Training Camp</strong><small>Demo interaction</small></div><div className="stars">★★☆</div></div>
      <button className="primary-cta wide" onClick={onComplete}>PLAY DEMO <span>▶</span></button>
      <button className="secondary-cta" onClick={onBack}>Back to village</button>
    </div>
  </main>
}
