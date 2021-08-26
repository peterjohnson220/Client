export interface JobContext {
  JobTitle: string;
  JobPayMarketId?: number;
  CompanyJobId: number;
  JobCode: string;
  PricingId?: number;
}

export function generateMockJobContext(): JobContext {
  return {
    JobTitle: 'Accountant',
    CompanyJobId: 12345,
    JobCode: 'AB1234'
  };
}
