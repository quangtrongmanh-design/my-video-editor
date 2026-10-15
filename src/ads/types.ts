export type AdPlacement =
  | "home_banner"
  | "project_list"
  | "export_complete"
  | "rewarded_effect";

export type AdContent = {
  id: string;
  title: string;
  imageUrl?: string;
  targetUrl?: string;
  placement: AdPlacement;
  active: boolean;
};

export type AdProviderKind = "own" | "network";

export interface AdProvider {
  readonly kind: AdProviderKind;
  isAvailable(): Promise<boolean>;
  // Providers should return a renderable ad only when it is valid for this placement.
  getAd(placement: AdPlacement): Promise<AdContent | null>;
}

export type AdSettings = {
  ownAdsEnabled: boolean;
  networkAdsEnabled: boolean;
  placements: Record<AdPlacement, boolean>;
  frequency: "low" | "medium" | "high";
};