
export interface GetCrowdSourcedJobPricingRequest {
  JobTitle: string;
  Country: string;
  PaymarketId?: number;
  SelectedFactors: CompensableFactorRequest[];
}

export interface CompensableFactorRequest {
  Name: string;
  SelectedFactors: string[];
}
