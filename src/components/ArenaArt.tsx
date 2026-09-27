import type { GameId } from '../types/game'

const art: Record<GameId, string> = {
  arrow: '/art/arena-arrow.svg',
  tapaway: '/art/arena-tap.svg',
  parking: '/art/arena-parking.svg',
  colorsort: '/art/arena-color.svg',
  reaction: '/art/arena-reaction.svg',
  memory: '/art/arena-memory.svg',
}

export function ArenaArt({ id, className = '' }: { id: GameId; className?: string }) {
  return <img className={`arena-art ${className}`} src={art[id]} alt="" />
}
