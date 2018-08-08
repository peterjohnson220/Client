export interface JobContext {
  JobTitle: string;
  PayMarketId: number;
  CurrencyCode: string;
  CompanyJobId: number;
  ProjectId: number;
}

export function generateMockJobContext(): JobContext {
  return {
    JobTitle: 'Accountant',
    PayMarketId: 1234,
    CurrencyCode: 'USD',
    CompanyJobId: 12345,
    ProjectId: 555
  };
}
