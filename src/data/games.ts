import type { MiniGame } from '../types/game'

export const games: MiniGame[] = [
  { id: 'arrow', name: 'Arrow Escape', subtitle: 'Clear the board in the right order', icon: '➹', accent: '#ff9f43', accent2: '#ff6b35', difficulty: 'Medium', bestScore: 1240, levels: 100, badge: 'HOT' },
  { id: 'tapaway', name: 'Tap Away', subtitle: 'Free every block without getting stuck', icon: '✦', accent: '#7d5fff', accent2: '#5f27cd', difficulty: 'Medium', bestScore: 980, levels: 100 },
  { id: 'parking', name: 'Parking Jam', subtitle: 'Unblock the road and escape the chaos', icon: '▰', accent: '#2ed573', accent2: '#1eaa59', difficulty: 'Easy', bestScore: 760, levels: 100 },
  { id: 'colorsort', name: 'Color Sort', subtitle: 'Stack every color into perfect groups', icon: '●', accent: '#00c2ff', accent2: '#1677ff', difficulty: 'Easy', bestScore: 1320, levels: 100 },
  { id: 'reaction', name: 'Reaction Rush', subtitle: 'Tap at exactly the right moment', icon: '⚡', accent: '#ffd32a', accent2: '#ff9f1a', difficulty: 'Hard', bestScore: 2150, levels: 100, badge: 'FAST' },
  { id: 'memory', name: 'Memory Flash', subtitle: 'Remember the pattern before it vanishes', icon: '◆', accent: '#ff6b9d', accent2: '#ee3f7c', difficulty: 'Hard', bestScore: 1540, levels: 100 },
]
