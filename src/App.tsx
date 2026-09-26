import { useState } from 'react'
import { TopBar } from './components/TopBar'
import { BottomNav, type TabId } from './components/BottomNav'
import { HomeScreen } from './screens/HomeScreen'
import { GamesScreen } from './screens/GamesScreen'
import { RewardsScreen } from './screens/RewardsScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { GameDetailScreen } from './screens/GameDetailScreen'
import type { MiniGame } from './types/game'

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null)
  const [coins, setCoins] = useState(8240)
  const [toast, setToast] = useState('')

  const completeDemo = () => {
    setCoins(v => v + 120)
    setToast('+120 coins · Demo complete!')
    setTimeout(() => setToast(''), 1800)
  }

  if (selectedGame) return <><GameDetailScreen game={selectedGame} onBack={() => setSelectedGame(null)} onComplete={completeDemo}/>{toast && <div className="toast">{toast}</div>}</>

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
