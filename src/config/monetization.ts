export const monetizationConfig = {
  adsEnabled: false,
  interstitialEveryCompletedLevels: 3,
  rewardedPlacements: ['revive', 'hint', 'double_coins'] as const,
}

export type RewardedPlacement = (typeof monetizationConfig.rewardedPlacements)[number]
