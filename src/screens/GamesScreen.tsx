import { games } from '../data/games'
import { GameCard } from '../components/GameCard'
import { SectionTitle } from '../components/SectionTitle'
import type { MiniGame } from '../types/game'

export function GamesScreen({ onPlay }: { onPlay: (game: MiniGame) => void }) {
  return <main className="screen"><SectionTitle eyebrow="ARCADE" title="All Mini Games"/><p className="screen-lead">Six fast challenges, one growing kingdom. More game modes can be plugged into this shell without changing the core UI.</p><div className="game-list full">{games.map(game => <GameCard key={game.id} game={game} onPlay={onPlay}/>)}</div></main>
}
