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
  const number = Math.max(1, levelNumber)
  const rows = number <= 3 ? 4 : number <= 12 ? 5 : 6
  const cols = rows
  const maxPieces = rows * cols - 2
  const targetPieces = Math.min(maxPieces, 6 + Math.floor(number * 1.45))
  const random = mulberry32(92021 + number * 7919)

  // Build the solution backwards. Every piece is placed only when its exit ray
  // is clear relative to pieces that will remain after it in the solve order.
  // Therefore reversing the placement order always produces a valid solution.
  const placed: ArrowPiece[] = []
  let attempts = 0

  while (placed.length < targetPieces && attempts < 5000) {
    attempts += 1
    const row = Math.floor(random() * rows)
    const col = Math.floor(random() * cols)
    if (placed.some((piece) => piece.row === row && piece.col === col)) continue

    const validDirections = shuffle(directions, random).filter((direction) =>
      canExit({ id: -1, row, col, direction }, placed, rows, cols),
    )

    if (!validDirections.length) continue

    placed.push({
      id: placed.length + 1,
      row,
      col,
      direction: validDirections[0],
    })
  }

  return {
    number,
    rows,
    cols,
    reward: 45 + number * 5,
    pieces: shuffle(placed, random),
  }
}

export const arrowGlyph: Record<ArrowDirection, string> = {
  up: '↑',
  right: '→',
  down: '↓',
  left: '←',
}
