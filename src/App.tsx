import { useEffect, useState } from 'react'
import { TopBar } from './components/TopBar'
import { BottomNav, type TabId } from './components/BottomNav'
import { HomeScreen } from './screens/HomeScreen'
import { GamesScreen } from './screens/GamesScreen'
import { RewardsScreen } from './screens/RewardsScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ArrowEscape } from './games/arrow/ArrowEscape'
import { MiniGameArena } from './games/MiniGameArena'
import type { MiniGame } from './types/game'

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null)
  const [coins, setCoins] = useState(() => {
    const stored = window.localStorage.getItem('minizap-coins')
    const saved = stored === null ? Number.NaN : Number(stored)
    return Number.isFinite(saved) && saved >= 0 ? saved : 8240
  })
  const [toast, setToast] = useState('')

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1800)
  }

  const awardCoins = (amount: number, message = `+${amount} coins`) => {
    setCoins((value) => {
      const next = value + amount
      window.localStorage.setItem('minizap-coins', String(next))
      return next
    })
    showToast(message)
  }

  useEffect(() => {
    document.body.classList.toggle('game-active', Boolean(selectedGame))
    return () => document.body.classList.remove('game-active')
  }, [selectedGame])

  if (selectedGame?.id === 'arrow') {
    return (
      <>
        <ArrowEscape onBack={() => setSelectedGame(null)} onEarnCoins={awardCoins} />
        {toast && <div className="toast">{toast}</div>}
      </>
    )
  }

  if (selectedGame) {
    return (
      <>
        <MiniGameArena
          game={selectedGame}
          onBack={() => setSelectedGame(null)}
          onEarnCoins={awardCoins}
        />
        {toast && <div className="toast">{toast}</div>}
      </>
    )
  }

  return (
    <div className="app-shell">
      <div className="sky-layer"><span/><span/><span/></div>
      <TopBar coins={coins} gems={42} level={12} xp={68}/>
      {tab === 'home' && <HomeScreen onPlay={setSelectedGame} onNavigate={setTab}/>}
      {tab === 'games' && <GamesScreen onPlay={setSelectedGame}/>}
      {tab === 'rewards' && <RewardsScreen/>}
      {tab === 'profile' && <ProfileScreen/>}
      <BottomNav active={tab} onChange={setTab}/>
    </div>
  )
}
