export type ArrowDirection = 'up' | 'right' | 'down' | 'left'

export interface ArrowPiece {
  id: number
  row: number
  col: number
  direction: ArrowDirection
}

export interface ArrowLevel {
  number: number
  rows: number
  cols: number
  reward: number
  pieces: ArrowPiece[]
}

const directions: ArrowDirection[] = ['up', 'right', 'down', 'left']

function mulberry32(seed: number) {
  let value = seed >>> 0
  return () => {
    value += 0x6d2b79f5
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(items: T[], random: () => number) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function canExit(
  piece: ArrowPiece,
  pieces: ArrowPiece[],
  rows: number,
  cols: number,
) {
  return !pieces.some((other) => {
    if (other.id === piece.id) return false

    switch (piece.direction) {
      case 'up':
        return other.col === piece.col && other.row < piece.row
      case 'down':
        return other.col === piece.col && other.row > piece.row && other.row < rows
      case 'left':
        return other.row === piece.row && other.col < piece.col
      case 'right':
        return other.row === piece.row && other.col > piece.col && other.col < cols
    }
  })
}

export function getAvailableMoves(
  pieces: ArrowPiece[],
  rows: number,
  cols: number,
) {
  return pieces.filter((piece) => canExit(piece, pieces, rows, cols))
}

export function generateArrowLevel(levelNumber: number): ArrowLevel {
  const number = Math.min(100, Math.max(1, levelNumber))
  const rows = number <= 18 ? 4 : number <= 55 ? 5 : 6
  const cols = rows
  const maxPieces = rows * cols - 2
  const targetPieces = Math.min(
    maxPieces,
    number <= 10
      ? 5 + Math.ceil(number * 0.55)
      : number <= 25
        ? 10 + Math.floor((number - 10) * 0.32)
        : number <= 45
          ? 14 + Math.floor((number - 25) * 0.35)
          : number <= 65
            ? 20 + Math.floor((number - 45) * 0.32)
            : 26 + Math.floor((number - 65) * 0.23),
  )
  const random = mulberry32(92021 + number * 7919)

  // Start dense, then peel one exposed cell at a time. A piece receives its
  // direction at the exact point it becomes removable. Replaying that peel
  // order is a guaranteed solution, while pieces assigned later are usually
  // blocked at the start — producing the constrained openings used in late game.
  const cells = shuffle(
    Array.from({ length: rows * cols }, (_, id) => ({
      id: id + 1,
      row: Math.floor(id / cols),
      col: id % cols,
      direction: 'up' as ArrowDirection,
    })),
    random,
  ).slice(0, targetPieces)
  const remaining = [...cells]
  const placed: ArrowPiece[] = []

  while (remaining.length) {
    const candidates = remaining.flatMap((piece) => {
      const valid = shuffle(directions, random).filter((direction) =>
        canExit({ ...piece, direction }, remaining, rows, cols),
      )
      return valid.length ? [{ piece, valid }] : []
    })
    const constrained = candidates.filter(({ piece, valid }) =>
      valid.some((direction) => !canExit({ ...piece, direction }, placed, rows, cols)),
    )
    const pool = constrained.length ? constrained : candidates
    const choice = pool[Math.floor(random() * pool.length)]
    const deceptiveDirections = choice.valid.filter((direction) =>
      !canExit({ ...choice.piece, direction }, placed, rows, cols),
    )
    const directionPool = deceptiveDirections.length ? deceptiveDirections : choice.valid
    const direction = directionPool[Math.floor(random() * directionPool.length)]
    placed.push({ ...choice.piece, direction })
    remaining.splice(remaining.findIndex((piece) => piece.id === choice.piece.id), 1)
  }

  return {
    number,
    rows,
    cols,
    reward: 45 + Math.floor((number - 1) / 10) * 5,
    pieces: shuffle(placed, random),
  }
}

export const arrowGlyph: Record<ArrowDirection, string> = {
  up: '↑',
  right: '→',
  down: '↓',
  left: '←',
}
