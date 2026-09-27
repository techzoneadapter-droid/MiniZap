import type { GameId } from '../types/game'

export interface GameProgress {
  level: number
  stars: Record<number, number>
  best: number
  streak: number
  bestStreak: number
}

const emptyProgress = (): GameProgress => ({
  level: 1,
  stars: {},
  best: 0,
  streak: 0,
  bestStreak: 0,
})

export function loadProgress(id: GameId): GameProgress {
  try {
    const raw = window.localStorage.getItem(`minizap-progress-${id}`)
    if (!raw) return emptyProgress()
    const parsed = JSON.parse(raw) as Partial<GameProgress>
    return {
      level: Math.min(100, Math.max(1, Number(parsed.level) || 1)),
      stars: parsed.stars && typeof parsed.stars === 'object' ? parsed.stars : {},
      best: Math.max(0, Number(parsed.best) || 0),
      streak: Math.max(0, Number(parsed.streak) || 0),
      bestStreak: Math.max(0, Number(parsed.bestStreak) || 0),
    }
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(id: GameId, progress: GameProgress) {
  window.localStorage.setItem(`minizap-progress-${id}`, JSON.stringify(progress))
}

export function chapterFor(level: number) {
  const n = Math.min(100, Math.max(1, level))
  const tier = Math.ceil(n / 20)
  const names = ['Green Fields', 'Crystal Woods', 'Golden Ridge', 'Storm Peaks', 'Royal Vault']
  return { tier, name: names[tier - 1] }
}

export function levelReward(level: number, stars = 3) {
  const base = 35 + Math.min(100, Math.max(1, level)) * 4 + stars * 12
  const milestone = level % 25 === 0 ? 500 : level % 10 === 0 ? 250 : level % 5 === 0 ? 100 : 0
  return { base, milestone, total: base + milestone }
}

export function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value += 0x6d2b79f5
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
