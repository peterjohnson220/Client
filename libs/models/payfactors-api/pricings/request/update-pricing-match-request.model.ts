import { PricingUpdateStrategy } from './pricing-update-strategy.enum';

export interface UpdatePricingMatchRequest {
  MatchId: number;
  MatchWeight: number;
  MatchAdjustment: number;
  SurveyDataId: number;
  PricingUpdateStrategy: PricingUpdateStrategy;
}
