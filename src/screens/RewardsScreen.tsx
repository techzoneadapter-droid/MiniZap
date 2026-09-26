const rewards = [
  { day: 'Day 1', icon: '●', value: '100', done: true },
  { day: 'Day 2', icon: '◆', value: '5', done: true },
  { day: 'Day 3', icon: '●', value: '250', done: true },
  { day: 'Day 4', icon: '★', value: 'Chest', active: true },
  { day: 'Day 5', icon: '◆', value: '10' },
  { day: 'Day 6', icon: '●', value: '500' },
  { day: 'Day 7', icon: '♛', value: 'Mega' },
]

export function RewardsScreen() {
  return <main className="screen"><section className="reward-hero"><div className="chest"><span>✦</span></div><span>WEEKLY TREASURE</span><h1>Keep the streak alive</h1><p>Come back every day to upgrade the chest.</p><div className="timer-pill">Next reward in 03:42:18</div></section><div className="reward-grid">{rewards.map(r=><div key={r.day} className={`reward-tile ${r.done?'done':''} ${r.active?'active':''}`}><small>{r.day}</small><span>{r.icon}</span><b>{r.value}</b>{r.done&&<i>✓</i>}</div>)}</div><button className="locked-cta">CLAIM DAY 4 REWARD</button></main>
}
