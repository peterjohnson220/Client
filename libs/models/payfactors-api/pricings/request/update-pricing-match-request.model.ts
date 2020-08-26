export enum PricingUpdateStrategy {
  ParentLinkedSlotted = 0,
  Parent = 1,
  LinkedSlotted = 2
}

export interface UpdatePricingMatchRequest {
  MatchId: number;
  MatchWeight: number;
  MatchAdjustment: number;
  SurveyDataId: number;
  PricingUpdateStrategy: PricingUpdateStrategy;
}
