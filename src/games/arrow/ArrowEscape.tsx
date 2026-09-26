import { useMemo, useState, type CSSProperties } from 'react'
import { maybeShowInterstitial, requestRewarded } from '../../services/ads'
import {
  arrowGlyph,
  canExit,
  generateArrowLevel,
  getAvailableMoves,
  type ArrowPiece,
} from './engine'
import './arrow.css'

interface ArrowEscapeProps {
  onBack: () => void
  onEarnCoins: (amount: number, message?: string) => void
}

type Phase = 'playing' | 'won' | 'lost'

const progressKey = 'minizap-arrow-level'

function loadStartingLevel() {
  const saved = Number(window.localStorage.getItem(progressKey) ?? '1')
  return Number.isFinite(saved) && saved > 0 ? Math.floor(saved) : 1
}

export function ArrowEscape({ onBack, onEarnCoins }: ArrowEscapeProps) {
  const [levelNumber, setLevelNumber] = useState(loadStartingLevel)
  const level = useMemo(() => generateArrowLevel(levelNumber), [levelNumber])
  const [pieces, setPieces] = useState<ArrowPiece[]>(() => level.pieces)
  const [mistakes, setMistakes] = useState(0)
  const [phase, setPhase] = useState<Phase>('playing')
  const [exitingId, setExitingId] = useState<number | null>(null)
  const [blockedId, setBlockedId] = useState<number | null>(null)
  const [hintId, setHintId] = useState<number | null>(null)

  const totalPieces = level.pieces.length
  const cleared = totalPieces - pieces.length
  const score = Math.max(0, cleared * 120 + level.number * 40 - mistakes * 80)
  const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1

  function haptic(pattern: number | number[]) {
    if ('vibrate' in navigator) navigator.vibrate(pattern)
  }

  function resetLevel(nextLevel = levelNumber) {
    const next = generateArrowLevel(nextLevel)
    setPieces(next.pieces)
    setMistakes(0)
    setPhase('playing')
    setExitingId(null)
    setBlockedId(null)
    setHintId(null)
  }

  function tapPiece(piece: ArrowPiece) {
    if (phase !== 'playing' || exitingId !== null) return
    setHintId(null)

    if (!canExit(piece, pieces, level.rows, level.cols)) {
      const nextMistakes = mistakes + 1
      setMistakes(nextMistakes)
      setBlockedId(piece.id)
      haptic([35, 35, 35])
      window.setTimeout(() => setBlockedId(null), 300)

      if (nextMistakes >= 3) {
        window.setTimeout(() => setPhase('lost'), 260)
      }
      return
    }

    setExitingId(piece.id)
    haptic(18)

    window.setTimeout(() => {
      setPieces((current) => {
        const next = current.filter((item) => item.id !== piece.id)
        if (next.length === 0) {
          const reward = level.reward
          onEarnCoins(reward, `+${reward} coins · Level ${level.number} cleared!`)
          window.setTimeout(() => setPhase('won'), 120)
        }
        return next
      })
      setExitingId(null)
    }, 220)
  }

  async function showHint() {
    if (phase !== 'playing') return
    const unlocked = await requestRewarded('hint')
    if (!unlocked) return

    const choices = getAvailableMoves(pieces, level.rows, level.cols)
    if (!choices.length) return
    setHintId(choices[0].id)
    haptic(12)
  }

  async function revive() {
    const unlocked = await requestRewarded('revive')
    if (!unlocked) return
    setMistakes(2)
    setPhase('playing')
    setBlockedId(null)
  }

  async function nextLevel() {
    const next = level.number + 1
    window.localStorage.setItem(progressKey, String(next))
    await maybeShowInterstitial(level.number)
    setLevelNumber(next)
    resetLevel(next)
  }

  const boardCells = Array.from({ length: level.rows * level.cols }, (_, index) => {
    const row = Math.floor(index / level.cols)
    const col = index % level.cols
    const piece = pieces.find((item) => item.row === row && item.col === col)

    return (
      <div className="arrow-cell" key={`${row}-${col}`}>
        {piece && (
          <button
            aria-label={`Arrow ${piece.direction}`}
            className={[
              'arrow-piece',
              `dir-${piece.direction}`,
              exitingId === piece.id ? 'is-exiting' : '',
              blockedId === piece.id ? 'is-blocked' : '',
              hintId === piece.id ? 'is-hint' : '',
            ].join(' ')}
            style={{ '--piece-hue': String((piece.id * 47 + level.number * 23) % 360) } as CSSProperties}
            onClick={() => tapPiece(piece)}
          >
            <span>{arrowGlyph[piece.direction]}</span>
          </button>
        )}
      </div>
    )
  })

  return (
    <main className="arrow-game">
      <div className="arrow-sky-orb orb-a" />
      <div className="arrow-sky-orb orb-b" />

      <header className="arrow-header">
        <button className="arrow-back" onClick={onBack}>‹</button>
        <div className="arrow-title">
          <small>ARROW ESCAPE</small>
          <strong>Level {level.number}</strong>
        </div>
        <div className="arrow-score"><small>SCORE</small><b>{score}</b></div>
      </header>

      <section className="arrow-status">
        <div className="heart-row" aria-label="Lives">
          {[0, 1, 2].map((index) => <span key={index} className={index < 3 - mistakes ? 'alive' : 'lost'}>♥</span>)}
        </div>
        <div className="clear-progress">
          <div><span style={{ width: `${totalPieces ? (cleared / totalPieces) * 100 : 0}%` }} /></div>
          <small>{cleared}/{totalPieces} cleared</small>
        </div>
        <button className="arrow-restart" onClick={() => resetLevel()}>↻</button>
      </section>

      <section className="arrow-board-wrap">
        <div className="board-banner"><span>Clear every arrow</span><b>Tap only when the path is open</b></div>
        <div
          className="arrow-board"
          style={{ '--cols': level.cols, '--rows': level.rows } as CSSProperties}
        >
          {boardCells}
        </div>
      </section>

      <section className="arrow-tools">
        <button onClick={showHint}><span>💡</span><div><b>Hint</b><small>Find a safe arrow</small></div></button>
        <div className="arrow-tip"><b>COMBO</b><strong>{Math.max(1, cleared - mistakes + 1)}×</strong></div>
        <button onClick={() => resetLevel()}><span>↻</span><div><b>Restart</b><small>Try a new route</small></div></button>
      </section>

      {phase !== 'playing' && (
        <div className="arrow-overlay">
          <div className={`arrow-modal ${phase}`}>
            <div className="modal-emblem">{phase === 'won' ? '♛' : '☠'}</div>
            <small>{phase === 'won' ? 'LEVEL CLEARED' : 'OUT OF HEARTS'}</small>
            <h2>{phase === 'won' ? 'Brilliant escape!' : 'The arrows got you'}</h2>
            {phase === 'won' ? (
              <>
                <div className="modal-stars">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
                <div className="modal-reward"><span>●</span><b>+{level.reward}</b> coins</div>
                <button className="arrow-main-action" onClick={nextLevel}>NEXT LEVEL <span>▶</span></button>
                <button className="arrow-text-action" onClick={() => resetLevel()}>Replay level</button>
              </>
            ) : (
              <>
                <p>Use a revive to keep the current board, or restart and solve it from a fresh angle.</p>
                <button className="arrow-main-action revive" onClick={revive}>▶ REVIVE</button>
                <button className="arrow-text-action" onClick={() => resetLevel()}>Restart level</button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
