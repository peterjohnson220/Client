export class AddToProjectRequest {
  JobIds: number[];
  PricingIds: number[];
  JobPayMarketSelections: JobPayMarketCombo[];
}

class JobPayMarketCombo {
  CompanyJobId: number;
  CompanyPayMarketId: number;
}
