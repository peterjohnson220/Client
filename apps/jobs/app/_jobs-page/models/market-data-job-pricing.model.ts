export interface MarketDataBaseJob {
  JobTitle: string;
  JobCode: string;
  EffectiveDate?: Date;
}

export interface MarketDataJobPricing extends MarketDataBaseJob {
  PricingId: number;
  PayMarket: string;
  PayMarketId: number;
  JobId?: number;
  Rate?: string;
  LinkedPayMarketName?: string;
}

export interface MarketDataJobPricingMatch extends MarketDataBaseJob {
  PricingMatchId: number;
  Source?: string;
  Weight?: number;
  Adjustment?: number;
  PricingId?: number;
}

export interface DeleteMatchModalData {
  JobPricing: MarketDataJobPricing;
  JobPricingMatch: MarketDataJobPricingMatch;
  PricingMatchesCount: number;
}
