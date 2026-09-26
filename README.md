# MiniZap

MiniZap is a mobile-first offline mini-game hub built for fast sessions, replayability, and ad-first monetization experiments.

## Product shell

- Fantasy-cartoon mobile UI with chunky panels, beveled buttons, bright rewards, and village-game energy.
- Home village / Daily Quest
- Six initial mini-game modules: Arrow Escape, Tap Away, Parking Jam, Color Sort, Reaction Rush, Memory Flash
- Coins, gems, XP, streak, daily challenge, weekly rewards and profile scaffolding
- Game detail shell separated from gameplay implementation
- Monetization config placeholder for interstitial/rewarded placement
- Capacitor configuration prepared for Android package `com.minizap.games`

## Run

```bash
npm install
npm run dev
```

## QA

```bash
npm run qa
```

## Android later

After gameplay and AdMob integration are ready:

```bash
npx cap add android
npm run build
npx cap sync android
```

## Architecture rule

Keep each mini-game independent. New gameplay should be plugged into the existing shell without rewriting navigation, progression, rewards, or monetization plumbing.
