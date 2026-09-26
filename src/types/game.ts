export type GameId = 'arrow' | 'tapaway' | 'parking' | 'colorsort' | 'reaction' | 'memory'

export interface MiniGame {
  id: GameId
  name: string
  subtitle: string
  icon: string
  accent: string
  accent2: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  bestScore: number
  levels: number
  badge?: string
}
