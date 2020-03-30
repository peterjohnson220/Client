export class CreateProjectRequest {
  JobIds: number[];
  PricingIds: number[];
  JobPayMarketSelections: JobPayMarketCombo[];
}

class JobPayMarketCombo {
  CompanyJobId: number;
  CompanyPayMarketId: number;
}
