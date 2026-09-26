import { monetizationConfig, type RewardedPlacement } from '../config/monetization'

export async function requestRewarded(placement: RewardedPlacement): Promise<boolean> {
  if (!monetizationConfig.adsEnabled) return true

  // Production hook: connect the native AdMob rewarded SDK here.
  // Keep gameplay independent from the ad provider so we can swap mediation later.
  console.info('[MiniZap ads] rewarded placement requested:', placement)
  return true
}

export async function maybeShowInterstitial(completedLevels: number): Promise<void> {
  if (!monetizationConfig.adsEnabled) return
  if (completedLevels <= 0) return
  if (completedLevels % monetizationConfig.interstitialEveryCompletedLevels !== 0) return

  // Production hook: show an interstitial only at a natural level-complete break.
  console.info('[MiniZap ads] interstitial checkpoint:', completedLevels)
}
