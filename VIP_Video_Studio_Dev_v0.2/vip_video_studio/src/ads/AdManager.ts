import { AdContent, AdPlacement, AdProvider, AdSettings } from "./types";

/**
 * Provider-agnostic ad coordinator.
 * Keep ad-network SDK code inside its own provider adapter, never in the editor.
 * Settings below are local defaults; remote configuration can replace this later.
 */
export class AdManager {
  constructor(
    private readonly ownProvider: AdProvider,
    private readonly networkProvider: AdProvider,
    private settings: AdSettings = {
      ownAdsEnabled: true,
      networkAdsEnabled: false,
      placements: {
        home_banner: true,
        project_list: false,
        export_complete: true,
        rewarded_effect: true
      },
      frequency: "low"
    }
  ) {}

  updateSettings(next: Partial<AdSettings>) {
    this.settings = { ...this.settings, ...next };
  }

  async getAd(placement: AdPlacement): Promise<AdContent | null> {
    if (!this.settings.placements[placement]) return null;

    // Prioritize owned campaigns. Fall back to network ads if no own campaign matches.
    if (this.settings.ownAdsEnabled && await this.ownProvider.isAvailable()) {
      const own = await this.ownProvider.getAd(placement);
      if (own?.active) return own;
    }

    if (this.settings.networkAdsEnabled && await this.networkProvider.isAvailable()) {
      const network = await this.networkProvider.getAd(placement);
      if (network?.active) return network;
    }

    return null;
  }
}