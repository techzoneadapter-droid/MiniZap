import { games } from '../data/games'
import { GameCard } from '../components/GameCard'
import type { MiniGame } from '../types/game'

export function GamesScreen({ onPlay }: { onPlay: (game: MiniGame) => void }) {
  return (
    <main className="screen games-screen">
      <div className="atlas-heading">
        <img src="/art/nav-games.svg" alt="" />
        <div><span>THE ADVENTURE ATLAS</span><h1>Choose an arena</h1></div>
      </div>
      <p className="screen-lead">
        Six magical grounds. One new legend to make.
      </p>
      <div className="game-list full">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onPlay={onPlay} />
        ))}
      </div>
    </main>
  )
}
