import { games } from '../data/games'
import { GameCard } from '../components/GameCard'
import { SectionTitle } from '../components/SectionTitle'
import type { MiniGame } from '../types/game'

export function GamesScreen({ onPlay }: { onPlay: (game: MiniGame) => void }) {
  return (
    <main className="screen games-screen">
      <SectionTitle eyebrow="THE ADVENTURE ATLAS" title="Discover your arena" />
      <p className="screen-lead">
        Six little worlds. Endless “one more try.” Choose a challenge and let
        the adventure begin.
      </p>
      <div className="game-list full">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onPlay={onPlay} />
        ))}
      </div>
    </main>
  )
}
