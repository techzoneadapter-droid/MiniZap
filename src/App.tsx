import { useState } from 'react'
import { TopBar } from './components/TopBar'
import { BottomNav, type TabId } from './components/BottomNav'
import { HomeScreen } from './screens/HomeScreen'
import { GamesScreen } from './screens/GamesScreen'
import { RewardsScreen } from './screens/RewardsScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { GameDetailScreen } from './screens/GameDetailScreen'
import { ArrowEscape } from './games/arrow/ArrowEscape'
import type { MiniGame } from './types/game'

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null)
  const [coins, setCoins] = useState(8240)
  const [toast, setToast] = useState('')

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1800)
  }

  const awardCoins = (amount: number, message = `+${amount} coins`) => {
    setCoins((value) => value + amount)
    showToast(message)
  }

  const completeDemo = () => {
    awardCoins(120, '+120 coins · Demo complete!')
  }

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
        <GameDetailScreen
          game={selectedGame}
          onBack={() => setSelectedGame(null)}
          onComplete={completeDemo}
        />
        {toast && <div className="toast">{toast}</div>}
      </>
    )
  }

  return (
    <div className="app-shell">
      <div className="sky-layer"><span/><span/><span/></div>
      <TopBar coins={coins} gems={42} level={12} xp={68}/>
      {tab === 'home' && <HomeScreen onPlay={setSelectedGame}/>}
      {tab === 'games' && <GamesScreen onPlay={setSelectedGame}/>}
      {tab === 'rewards' && <RewardsScreen/>}
      {tab === 'profile' && <ProfileScreen/>}
      <BottomNav active={tab} onChange={setTab}/>
    </div>
  )
}
