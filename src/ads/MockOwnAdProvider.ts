import { AdProvider, AdContent, AdPlacement } from "./types";

/** Demo provider only. Replace with a real campaign feed/admin API before launch. */
export class MockOwnAdProvider implements AdProvider {
  readonly kind = "own" as const;

  async isAvailable() {
    return true;
  }

  async getAd(placement: AdPlacement): Promise<AdContent | null> {
    if (placement !== "home_banner" && placement !== "export_complete") return null;
    return {
      id: "demo-vip-campaign",
      title: "Khu vực quảng cáo riêng của bạn",
      placement,
      active: true
    };
  }
}