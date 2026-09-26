import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { maybeShowInterstitial, requestRewarded } from '../../services/ads'
import { playSfx } from '../../services/sfx'
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

interface Feedback {
  id: number
  text: string
  kind: 'good' | 'bad' | 'combo'
}

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
  const [combo, setCombo] = useState(0)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [levelIntro, setLevelIntro] = useState(true)
  const [bonusClaimed, setBonusClaimed] = useState(false)

  const totalPieces = level.pieces.length
  const cleared = totalPieces - pieces.length
  const score = Math.max(0, cleared * 120 + combo * 35 + level.number * 40 - mistakes * 80)
  const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1
  const chestStep = ((level.number - 1) % 5) + 1
  const chestReady = level.number % 5 === 0

  useEffect(() => {
    setLevelIntro(true)
    const timer = window.setTimeout(() => setLevelIntro(false), 720)
    return () => window.clearTimeout(timer)
  }, [levelNumber])

  function haptic(pattern: number | number[]) {
    if ('vibrate' in navigator) navigator.vibrate(pattern)
  }

  function flash(text: string, kind: Feedback['kind']) {
    setFeedback({ id: Date.now(), text, kind })
    window.setTimeout(() => setFeedback(null), 720)
  }

  function resetLevel(nextLevel = levelNumber) {
    const next = generateArrowLevel(nextLevel)
    setPieces(next.pieces)
    setMistakes(0)
    setPhase('playing')
    setExitingId(null)
    setBlockedId(null)
    setHintId(null)
    setCombo(0)
    setFeedback(null)
    setBonusClaimed(false)
    setLevelIntro(true)
    window.setTimeout(() => setLevelIntro(false), 720)
    playSfx('level')
  }

  function tapPiece(piece: ArrowPiece) {
    if (phase !== 'playing' || exitingId !== null || levelIntro) return
    setHintId(null)
    playSfx('tap')

    if (!canExit(piece, pieces, level.rows, level.cols)) {
      const nextMistakes = mistakes + 1
      setMistakes(nextMistakes)
      setCombo(0)
      setBlockedId(piece.id)
      flash('BLOCKED!', 'bad')
      playSfx('blocked')
      haptic([35, 35, 35])
      window.setTimeout(() => setBlockedId(null), 300)

      if (nextMistakes >= 3) {
        window.setTimeout(() => {
          playSfx('lose')
          setPhase('lost')
        }, 260)
      }
      return
    }

    const nextCombo = combo + 1
    setCombo(nextCombo)
    setExitingId(piece.id)
    flash(nextCombo >= 3 ? `${nextCombo}× COMBO!` : '+120', nextCombo >= 3 ? 'combo' : 'good')
    playSfx(nextCombo >= 3 ? 'clear' : 'tap')
    haptic(nextCombo >= 3 ? [15, 25, 22] : 18)

    window.setTimeout(() => {
      setPieces((current) => {
        const next = current.filter((item) => item.id !== piece.id)
        if (next.length === 0) {
          const reward = level.reward
          onEarnCoins(reward, `+${reward} coins · Level ${level.number} cleared!`)
          window.setTimeout(() => {
            playSfx('win')
            haptic([25, 35, 25, 35, 55])
            setPhase('won')
          }, 120)
        }
        return next
      })
      setExitingId(null)
    }, 220)
  }

  async function showHint() {
    if (phase !== 'playing' || levelIntro) return
    const unlocked = await requestRewarded('hint')
    if (!unlocked) return

    const choices = getAvailableMoves(pieces, level.rows, level.cols)
    if (!choices.length) return
    setHintId(choices[0].id)
    playSfx('hint')
    flash('SAFE MOVE', 'good')
    haptic(12)
  }

  async function revive() {
    const unlocked = await requestRewarded('revive')
    if (!unlocked) return
    setMistakes(2)
    setCombo(0)
    setPhase('playing')
    setBlockedId(null)
    playSfx('reward')
    haptic([15, 30, 25])
  }

  async function claimDoubleCoins() {
    if (bonusClaimed) return
    const unlocked = await requestRewarded('double_coins')
    if (!unlocked) return
    setBonusClaimed(true)
    onEarnCoins(level.reward, `+${level.reward} bonus coins!`)
    playSfx('reward')
    haptic([18, 20, 18])
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
      <div className="arrow-ambient" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => <i key={index} className={`ambient-${index + 1}`} />)}
      </div>
      <div className="arrow-hills hill-a" aria-hidden="true" />
      <div className="arrow-hills hill-b" aria-hidden="true" />

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
        <span className="arena-gem gem-left">◆</span>
        <span className="arena-gem gem-right">◆</span>
        <div className="board-banner"><span><i>⚔</i> Clear every arrow</span><b>Tap only when the path is open</b></div>
        <div className="arrow-board-stage">
          <div
            className="arrow-board"
            style={{ '--cols': level.cols, '--rows': level.rows } as CSSProperties}
          >
            {boardCells}
          </div>

          {feedback && <div key={feedback.id} className={`arrow-feedback ${feedback.kind}`}>{feedback.text}</div>}

          {levelIntro && (
            <div className="arrow-level-intro">
              <small>ARROW ESCAPE</small>
              <b>LEVEL {level.number}</b>
              <span>GO!</span>
            </div>
          )}
        </div>
      </section>

      <section className="arrow-tools">
        <button onClick={showHint}><span>💡</span><div><b>Hint</b><small>Find a safe arrow</small></div></button>
        <div className={`arrow-tip ${combo >= 3 ? 'hot' : ''}`}><span className="combo-crown">♛</span><b>COMBO</b><strong>{Math.max(1, combo)}×</strong></div>
        <button onClick={() => resetLevel()}><span>↻</span><div><b>Restart</b><small>Try a new route</small></div></button>
      </section>

      <section className="arrow-treasure">
        <div className={`mini-chest ${chestReady ? 'ready' : ''}`}><span>✦</span></div>
        <div className="treasure-copy">
          <div><b>{chestReady ? 'Treasure ready!' : 'Treasure trail'}</b><small>{chestReady ? 'Clear this level to finish the set' : `${5 - chestStep} levels until the next chest`}</small></div>
          <div className="treasure-track"><span style={{ width: `${(chestStep / 5) * 100}%` }} /></div>
        </div>
        <div className="treasure-count">{chestStep}/5</div>
      </section>

      {phase !== 'playing' && (
        <div className="arrow-overlay">
          <div className="confetti" aria-hidden="true">
            {phase === 'won' && Array.from({ length: 12 }, (_, index) => <i key={index} style={{ '--i': index, '--left': `${4 + index * 7.6}%` } as CSSProperties}/>)}
          </div>
          <div className={`arrow-modal ${phase}`}>
            <div className="modal-emblem">{phase === 'won' ? '♛' : '☠'}</div>
            <small>{phase === 'won' ? 'LEVEL CLEARED' : 'OUT OF HEARTS'}</small>
            <h2>{phase === 'won' ? 'Brilliant escape!' : 'The arrows got you'}</h2>
            {phase === 'won' ? (
              <>
                <div className="modal-stars">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
                <div className="modal-scoreline"><span>Score</span><b>{score}</b><span>Combo</span><b>{Math.max(1, combo)}×</b></div>
                <div className="modal-reward"><span>●</span><b>+{level.reward}</b> coins</div>
                <button className="arrow-main-action" onClick={nextLevel}>NEXT LEVEL <span>▶</span></button>
                <button className={`double-reward ${bonusClaimed ? 'claimed' : ''}`} onClick={claimDoubleCoins} disabled={bonusClaimed}>
                  <span>▶</span>{bonusClaimed ? 'BONUS CLAIMED' : `2× COINS · +${level.reward}`}
                </button>
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
