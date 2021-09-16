export interface GetCrowdSourcedJobPricingRequest {
  JobTitle: string;
  Country: string;
  PaymarketId?: number;
  SelectedFactors: CompensableFactorRequest[];
  IncludeExportData?: boolean;
}

export interface CompensableFactorRequest {
  Name: string;
  SelectedFactors: string[];
}
