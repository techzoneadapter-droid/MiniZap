import { GameIcon } from '../components/GameIcon'
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
      <div className="destination-heading">
        <span>THE ROYAL VAULT</span>
        <h1>Treasure room</h1>
        <p>Return daily. Grow the hoard.</p>
      </div>
      <section className="reward-hero">
        <div className="vault-arch" aria-hidden="true" />
        <div className="vault-ray" aria-hidden="true" />
        <img className="vault-coin coin-one" src="/art/resource-coin.svg" alt="" />
        <img className="vault-coin coin-two" src="/art/resource-coin.svg" alt="" />
        <img className="vault-gem" src="/art/resource-gem.svg" alt="" />
        <img
          className="reward-hero-chest"
          src="/art/treasure-chest.svg"
          alt=""
        />
        <span>DAY 4 · RARE TREASURE</span>
        <h2>Your chest is ready!</h2>
        <p>Gold, gems, and a mystery boost are waiting.</p>
        <button className="vault-claim">CLAIM REWARD <b>›</b></button>
        <div className="timer-pill">Next upgrade · 03:42:18</div>
      </section>
      <div className="section-title">
        <div>
          <span>WEEKLY TRAIL</span>
          <h2>Seven days of treasure</h2>
        </div>
      </div>
      <div className="reward-grid">
        {rewards.map((r, index) => (
          <div
            key={r.day}
            className={`reward-tile ${r.done ? 'done' : ''} ${r.active ? 'active' : ''}`}
          >
            <small>{r.day}</small>
            <img
              src={
                r.value === 'Chest' || r.value === 'Mega'
                  ? '/art/treasure-chest.svg'
                  : index % 3 === 1
                    ? '/art/resource-gem.svg'
                    : '/art/resource-coin.svg'
              }
              alt=""
            />
            <b>{r.value}</b>
            {r.done && (
              <i>
                <GameIcon name="check" />
              </i>
            )}
          </div>
        ))}
      </div>
      <p className="destination-note">
        Claim today to power up tomorrow's chest.
      </p>
    </main>
  )
}
