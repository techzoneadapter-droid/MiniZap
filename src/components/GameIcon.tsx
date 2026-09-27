import type { CSSProperties } from 'react'

type IconName = 'play' | 'heart' | 'restart' | 'star' | 'check' | 'arrow'

export function GameIcon({
  name,
  rotate = 0,
  className = '',
}: {
  name: IconName
  rotate?: number
  className?: string
}) {
  const style = { transform: `rotate(${rotate}deg)` } as CSSProperties
  const common = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className: `game-icon ${className}`,
    style,
    'aria-hidden': true,
  }

  if (name === 'play') return <svg {...common}><path d="M8 5.5L18.5 12L8 18.5V5.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
  if (name === 'heart') return <svg {...common}><path d="M12 20S4 15.2 4 9.5C4 6.6 6 5 8.3 5C10 5 11.2 6 12 7.2C12.8 6 14 5 15.7 5C18 5 20 6.6 20 9.5C20 15.2 12 20 12 20Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/></svg>
  if (name === 'restart') return <svg {...common}><path d="M6.5 7.2A7 7 0 1 1 5 14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/><path d="M5 4.5V8.6H9.1" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  if (name === 'star') return <svg {...common}><path d="M12 3.5L14.5 8.6L20.2 9.4L16.1 13.4L17.1 19L12 16.3L6.9 19L7.9 13.4L3.8 9.4L9.5 8.6L12 3.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
  if (name === 'check') return <svg {...common}><path d="M5 12.5L9.5 17L19 7.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  return <svg {...common}><path d="M4 12H18M13 7L18 12L13 17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
