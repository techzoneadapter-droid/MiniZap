type ToneKind = 'tap' | 'clear' | 'blocked' | 'hint' | 'win' | 'lose' | 'reward' | 'level'

let audioContext: AudioContext | null = null

function getContext() {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null
  if (!audioContext) audioContext = new AudioContext()
  if (audioContext.state === 'suspended') void audioContext.resume()
  return audioContext
}

function note(ctx: AudioContext, frequency: number, start: number, duration: number, volume = 0.045, type: OscillatorType = 'sine') {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.02)
}

export function playSfx(kind: ToneKind) {
  const ctx = getContext()
  if (!ctx) return
  const now = ctx.currentTime

  switch (kind) {
    case 'tap':
      note(ctx, 520, now, 0.07, 0.025, 'triangle')
      break
    case 'clear':
      note(ctx, 620, now, 0.08, 0.035, 'triangle')
      note(ctx, 820, now + 0.045, 0.09, 0.028, 'sine')
      break
    case 'blocked':
      note(ctx, 145, now, 0.11, 0.055, 'square')
      note(ctx, 112, now + 0.07, 0.12, 0.045, 'square')
      break
    case 'hint':
      note(ctx, 660, now, 0.1, 0.03, 'sine')
      note(ctx, 880, now + 0.07, 0.13, 0.03, 'sine')
      break
    case 'win':
      note(ctx, 523, now, 0.14, 0.04, 'triangle')
      note(ctx, 659, now + 0.08, 0.16, 0.04, 'triangle')
      note(ctx, 784, now + 0.16, 0.22, 0.045, 'triangle')
      break
    case 'lose':
      note(ctx, 240, now, 0.16, 0.04, 'sawtooth')
      note(ctx, 180, now + 0.1, 0.2, 0.035, 'sawtooth')
      break
    case 'reward':
      note(ctx, 740, now, 0.1, 0.035, 'sine')
      note(ctx, 980, now + 0.06, 0.14, 0.035, 'sine')
      break
    case 'level':
      note(ctx, 392, now, 0.08, 0.025, 'triangle')
      note(ctx, 523, now + 0.05, 0.1, 0.03, 'triangle')
      break
  }
}
