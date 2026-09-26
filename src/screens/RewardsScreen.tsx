const rewards = [
  { day: 'Day 1', value: '100', done: true },
  { day: 'Day 2', value: '5', done: true },
  { day: 'Day 3', value: '250', done: true },
  { day: 'Day 4', value: 'Chest', active: true },
  { day: 'Day 5', value: '10' },
  { day: 'Day 6', value: '500' },
  { day: 'Day 7', value: 'Mega' },
]

export function RewardsScreen() {
  return (
    <main className="screen rewards-screen-premium">
      <section className="reward-hero">
        <img className="reward-hero-chest" src="/art/treasure-chest.svg" alt="" />
        <span>WEEKLY TREASURE</span>
        <h1>Keep the streak alive</h1>
        <p>Come back every day to upgrade the chest.</p>
        <div className="timer-pill">Next reward in 03:42:18</div>
      </section>
      <div className="reward-grid">
        {rewards.map((r, index) => (
          <div key={r.day} className={`reward-tile ${r.done?'done':''} ${r.active?'active':''}`}>
            <small>{r.day}</small>
            <img src={index % 3 === 1 ? '/art/resource-gem.svg' : '/art/resource-coin.svg'} alt="" />
            <b>{r.value}</b>
            {r.done&&<i>✓</i>}
          </div>
        ))}
      </div>
      <button className="locked-cta">CLAIM DAY 4 REWARD</button>
    </main>
  )
}
