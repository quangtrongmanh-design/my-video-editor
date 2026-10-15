import { AdProvider, AdContent, AdPlacement } from "./types";

/**
 * Adapter placeholder for AdMob or another approved network.
 * This intentionally does not fabricate ads or revenue. Implement with the chosen
 * network's official SDK, consent flow, test ad units, and platform-specific setup.
 */
export class NetworkAdProvider implements AdProvider {
  readonly kind = "network" as const;

  async isAvailable() {
    return false; // Disabled until an SDK and valid ad-unit IDs are configured.
  }

  async getAd(_placement: AdPlacement): Promise<AdContent | null> {
    return null;
  }
}