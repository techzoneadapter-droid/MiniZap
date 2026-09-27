import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { ArenaArt } from '../components/ArenaArt'
import { GameIcon } from '../components/GameIcon'
import type { MiniGame } from '../types/game'
import { playSfx } from '../services/sfx'
import { chapterFor, levelReward, loadProgress, saveProgress, seededRandom } from './gameUtils'
import './miniGames.css'

interface Props {
  game: MiniGame
  onBack: () => void
  onEarnCoins: (amount: number, message?: string) => void
}

type Result = 'playing' | 'won' | 'lost'

function useLevel(game: MiniGame) {
  const initial = loadProgress(game.id)
  const [level, setLevel] = useState(Math.min(100, Math.max(1, initial.level)))
  const advance = () => setLevel((value) => Math.min(100, value + 1))
  return { level, advance }
}

function complete(
  game: MiniGame,
  level: number,
  score: number,
  stars: number,
  onEarnCoins: Props['onEarnCoins'],
) {
  const progress = loadProgress(game.id)
  const reward = levelReward(level, stars)
  const nextStreak = progress.streak + 1
  saveProgress(game.id, {
    ...progress,
    level: Math.max(progress.level, Math.min(100, level + 1)),
    stars: { ...progress.stars, [level]: Math.max(progress.stars[level] ?? 0, stars) },
    best: Math.max(progress.best, score),
    streak: nextStreak,
    bestStreak: Math.max(progress.bestStreak, nextStreak),
  })
  onEarnCoins(reward.total, `+${reward.total} coins · ${game.name} cleared!`)
}

function ResultPanel({
  result,
  score,
  stars,
  level,
  onNext,
  onRetry,
}: {
  result: Result
  score: number
  stars: number
  level: number
  onNext: () => void
  onRetry: () => void
}) {
  if (result === 'playing') return null
  return (
    <div className="mini-result-overlay">
      <div className={`mini-result-card ${result}`}>
        <img src={result === 'won' ? '/art/treasure-chest.svg' : '/art/zapling-hero.svg'} alt="" />
        <small>{result === 'won' ? 'LEVEL CLEARED' : 'TRY AGAIN'}</small>
        <h2>{result === 'won' ? 'Nice work!' : 'Almost there!'}</h2>
        {result === 'won' && (
          <div className="mini-result-stars">
            {[0, 1, 2].map((index) => <GameIcon key={index} name="star" className={index < stars ? 'earned' : 'unearned'} />)}
          </div>
        )}
        <div className="mini-result-score"><span>Score</span><b>{score.toLocaleString()}</b></div>
        <button className="mini-primary" onClick={result === 'won' ? onNext : onRetry}>
          {result === 'won' ? (level === 100 ? 'PLAY AGAIN' : 'NEXT LEVEL') : 'RETRY'} <GameIcon name="play" />
        </button>
      </div>
    </div>
  )
}

function SequencePuzzle({ game, onBack, onEarnCoins }: Props) {
  const { level, advance } = useLevel(game)
  const chapter = chapterFor(level)
  const count = Math.min(22, 6 + Math.floor(level / 6))
  const seed = useMemo(() => seededRandom(level * 991 + game.id.length * 157), [level, game.id])
  const order = useMemo(() => {
    const items = Array.from({ length: count }, (_, index) => index + 1)
    return items.sort(() => seed() - 0.5)
  }, [count, seed])
  const [remaining, setRemaining] = useState(order)
  const [mistakes, setMistakes] = useState(0)
  const [result, setResult] = useState<Result>('playing')
  const target = Math.min(...remaining)
  const score = (count - remaining.length) * 150 + level * 50 - mistakes * 75
  const isParking = game.id === 'parking'
  const isTap = game.id === 'tapaway'

  useEffect(() => {
    setRemaining(order)
    setMistakes(0)
    setResult('playing')
  }, [order])

  function choose(value: number) {
    if (result !== 'playing') return
    if (value !== target) {
      const next = mistakes + 1
      setMistakes(next)
      playSfx('blocked')
      if (next >= 3) setResult('lost')
      return
    }
    playSfx('clear')
    setRemaining((items) => {
      const next = items.filter((item) => item !== value)
      if (!next.length) {
        const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1
        complete(game, level, score + 150, stars, onEarnCoins)
        setResult('won')
        playSfx('win')
      }
      return next
    })
  }

  function next() {
    advance()
  }

  function retry() {
    setRemaining(order)
    setMistakes(0)
    setResult('playing')
  }

  return (
    <ArenaFrame game={game} level={level} chapter={chapter.name} score={score} onBack={onBack}>
      <div className={`sequence-board ${isParking ? 'parking-board' : ''} ${isTap ? 'tap-board' : ''}`}>
        {remaining.map((value, index) => (
          <button
            key={value}
            className="sequence-piece"
            style={{
              '--x': `${(index * 37 + value * 19) % 78}%`,
              '--y': `${(index * 53 + value * 11) % 68}%`,
              '--h': String((value * 43 + level * 17) % 360),
            } as CSSProperties}
            onClick={() => choose(value)}
          >
            {isParking ? <span className="car-shape">▰</span> : <span>{isTap ? '✦' : value}</span>}
            <small>{value}</small>
          </button>
        ))}
        <div className="sequence-goal"><small>NEXT</small><b>{target || '✓'}</b></div>
      </div>
      <div className="mini-hud-row">
        <div><span>♥</span><b>{Math.max(0, 3 - mistakes)}</b><small>lives</small></div>
        <div><b>{count - remaining.length}/{count}</b><small>cleared</small></div>
        <div><b>{Math.max(1, count - remaining.length + 1)}×</b><small>combo</small></div>
      </div>
      <ResultPanel result={result} score={score} stars={mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1} level={level} onNext={next} onRetry={retry} />
    </ArenaFrame>
  )
}

type Tube = number[]

function buildColorLevel(level: number) {
  const colors = Math.min(6, 3 + Math.floor(level / 22))
  const height = 4
  const values = Array.from({ length: colors }, (_, index) => index)
  const pool = values.flatMap((value) => Array.from({ length: height }, () => value))
  const random = seededRandom(5000 + level * 313)
  pool.sort(() => random() - 0.5)
  const tubes: Tube[] = []
  for (let i = 0; i < colors; i += 1) tubes.push(pool.slice(i * height, i * height + height))
  tubes.push([], [])
  return { tubes, height }
}

function ColorSortGame({ game, onBack, onEarnCoins }: Props) {
  const { level, advance } = useLevel(game)
  const generated = useMemo(() => buildColorLevel(level), [level])
  const [tubes, setTubes] = useState<Tube[]>(generated.tubes)
  const [selected, setSelected] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [result, setResult] = useState<Result>('playing')
  const score = Math.max(0, 2500 + level * 60 - moves * 35)

  useEffect(() => {
    setTubes(generated.tubes)
    setSelected(null)
    setMoves(0)
    setResult('playing')
  }, [generated])

  function solved(next: Tube[]) {
    return next.every((tube) => tube.length === 0 || (tube.length === generated.height && tube.every((value) => value === tube[0])))
  }

  function tap(index: number) {
    if (result !== 'playing') return
    if (selected === null) {
      if (tubes[index].length) setSelected(index)
      return
    }
    if (selected === index) {
      setSelected(null)
      return
    }
    const source = tubes[selected]
    const destination = tubes[index]
    const value = source[source.length - 1]
    const canMove = destination.length < generated.height && (destination.length === 0 || destination[destination.length - 1] === value)
    if (!canMove) {
      playSfx('blocked')
      setSelected(null)
      return
    }
    const next = tubes.map((tube) => [...tube])
    next[selected].pop()
    next[index].push(value)
    setTubes(next)
    setMoves((v) => v + 1)
    setSelected(null)
    playSfx('tap')
    if (solved(next)) {
      complete(game, level, score, moves <= 12 ? 3 : moves <= 20 ? 2 : 1, onEarnCoins)
      setResult('won')
      playSfx('win')
    }
  }

  function retry() {
    setTubes(generated.tubes)
    setSelected(null)
    setMoves(0)
    setResult('playing')
  }

  return (
    <ArenaFrame game={game} level={level} chapter={chapterFor(level).name} score={score} onBack={onBack}>
      <div className="color-board">
        {tubes.map((tube, index) => (
          <button key={index} className={`color-tube ${selected === index ? 'selected' : ''}`} onClick={() => tap(index)}>
            <div className="tube-glass">
              {tube.map((value, itemIndex) => <span key={itemIndex} style={{ '--c': String(value) } as CSSProperties} />)}
            </div>
          </button>
        ))}
      </div>
      <div className="mini-hud-row"><div><b>{moves}</b><small>moves</small></div><div><b>{Math.max(0, 3 - Math.floor(moves / 14))}</b><small>stars pace</small></div><div><b>{level}/100</b><small>progress</small></div></div>
      <ResultPanel result={result} score={score} stars={moves <= 12 ? 3 : moves <= 20 ? 2 : 1} level={level} onNext={advance} onRetry={retry} />
    </ArenaFrame>
  )
}

function ReactionGame({ game, onBack, onEarnCoins }: Props) {
  const { level, advance } = useLevel(game)
  const [round, setRound] = useState(0)
  const [ready, setReady] = useState(false)
  const [waiting, setWaiting] = useState(true)
  const [startedAt, setStartedAt] = useState(0)
  const [times, setTimes] = useState<number[]>([])
  const [result, setResult] = useState<Result>('playing')

  useEffect(() => {
    if (result !== 'playing' || round >= 5) return
    setReady(false)
    setWaiting(true)
    const random = seededRandom(level * 811 + round * 37)
    const timer = window.setTimeout(() => {
      setWaiting(false)
      setReady(true)
      setStartedAt(performance.now())
      playSfx('hint')
    }, 700 + random() * Math.max(550, 1450 - level * 5))
    return () => window.clearTimeout(timer)
  }, [round, level, result])

  const average = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0
  const score = times.length ? Math.max(0, Math.round(7000 - average * 9 + level * 30)) : 0

  function tap() {
    if (!ready) {
      playSfx('blocked')
      return
    }
    const time = Math.round(performance.now() - startedAt)
    const next = [...times, time]
    setTimes(next)
    setReady(false)
    playSfx('clear')
    if (round === 4) {
      const avg = Math.round(next.reduce((a, b) => a + b, 0) / next.length)
      const finalScore = Math.max(0, Math.round(7000 - avg * 9 + level * 30))
      const stars = avg < 330 ? 3 : avg < 480 ? 2 : 1
      complete(game, level, finalScore, stars, onEarnCoins)
      setResult('won')
      playSfx('win')
    } else setRound((value) => value + 1)
  }

  function retry() {
    setRound(0); setTimes([]); setResult('playing'); setReady(false); setWaiting(true)
  }

  return (
    <ArenaFrame game={game} level={level} chapter={chapterFor(level).name} score={score} onBack={onBack}>
      <button className={`reaction-pad ${ready ? 'ready' : waiting ? 'waiting' : ''}`} onClick={tap}>
        <span>{ready ? 'TAP!' : waiting ? 'WAIT…' : 'READY'}</span>
        <small>{round + 1}/5</small>
      </button>
      <div className="mini-hud-row"><div><b>{average || '—'} ms</b><small>average</small></div><div><b>{times.length}</b><small>completed</small></div><div><b>{level}/100</b><small>level</small></div></div>
      <ResultPanel result={result} score={score} stars={average < 330 ? 3 : average < 480 ? 2 : 1} level={level} onNext={advance} onRetry={retry} />
    </ArenaFrame>
  )
}

function MemoryGame({ game, onBack, onEarnCoins }: Props) {
  const { level, advance } = useLevel(game)
  const length = Math.min(12, 3 + Math.floor(level / 10))
  const sequence = useMemo(() => {
    const random = seededRandom(9000 + level * 977)
    return Array.from({ length }, () => Math.floor(random() * 4))
  }, [level, length])
  const [showIndex, setShowIndex] = useState(-1)
  const [input, setInput] = useState<number[]>([])
  const [showing, setShowing] = useState(true)
  const [result, setResult] = useState<Result>('playing')

  useEffect(() => {
    setInput([]); setResult('playing'); setShowing(true); setShowIndex(-1)
    let index = 0
    const timer = window.setInterval(() => {
      setShowIndex(index)
      index += 1
      if (index >= sequence.length) {
        window.clearInterval(timer)
        window.setTimeout(() => { setShowIndex(-1); setShowing(false) }, 420)
      }
    }, Math.max(300, 620 - level * 3))
    return () => window.clearInterval(timer)
  }, [sequence, level])

  function press(value: number) {
    if (showing || result !== 'playing') return
    const next = [...input, value]
    if (sequence[next.length - 1] !== value) {
      playSfx('blocked')
      setResult('lost')
      return
    }
    setInput(next)
    playSfx('tap')
    if (next.length === sequence.length) {
      const score = 1500 + level * 70 + sequence.length * 180
      complete(game, level, score, 3, onEarnCoins)
      setResult('won')
      playSfx('win')
    }
  }

  const score = input.length * 180 + level * 70
  return (
    <ArenaFrame game={game} level={level} chapter={chapterFor(level).name} score={score} onBack={onBack}>
      <div className="memory-board">
        {[0,1,2,3].map((value) => <button key={value} className={`memory-pad pad-${value} ${showIndex >= 0 && sequence[showIndex] === value ? 'lit' : ''}`} onClick={() => press(value)}><span>{value + 1}</span></button>)}
      </div>
      <div className="memory-status">{showing ? 'WATCH THE PATTERN' : `${input.length}/${sequence.length} repeated`}</div>
      <ResultPanel result={result} score={score} stars={result === 'won' ? 3 : 0} level={level} onNext={advance} onRetry={() => window.location.reload()} />
    </ArenaFrame>
  )
}

function ArenaFrame({
  game,
  level,
  chapter,
  score,
  onBack,
  children,
}: {
  game: MiniGame
  level: number
  chapter: string
  score: number
  onBack: () => void
  children: React.ReactNode
}) {
  return (
    <main className={`mini-game-screen mini-${game.id}`}>
      <header className="mini-game-header">
        <button onClick={onBack} aria-label="Back">‹</button>
        <ArenaArt id={game.id} />
        <div><small>{chapter.toUpperCase()}</small><strong>{game.name}</strong><span>Level {level} / 100</span></div>
        <div className="mini-score"><small>SCORE</small><b>{score}</b></div>
      </header>
      <section className="mini-game-stage">{children}</section>
    </main>
  )
}

export function MiniGameArena(props: Props) {
  if (props.game.id === 'colorsort') return <ColorSortGame {...props} />
  if (props.game.id === 'reaction') return <ReactionGame {...props} />
  if (props.game.id === 'memory') return <MemoryGame {...props} />
  return <SequencePuzzle {...props} />
}
