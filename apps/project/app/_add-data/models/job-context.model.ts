export interface JobContext {
  JobTitle: string;
  PayMarketId: number;
  JobPayMarketId?: number;
  CurrencyCode: string;
  CompanyJobId: number;
  ProjectId: number;
  CountryCode: string;
  JobCode: string;
  RestrictToCountryCode: boolean;
}

export function generateMockJobContext(): JobContext {
  return {
    JobTitle: 'Accountant',
    PayMarketId: 1234,
    CurrencyCode: 'USD',
    CompanyJobId: 12345,
    ProjectId: 555,
    CountryCode: 'USA',
    JobCode: 'AB1234',
    RestrictToCountryCode: false
  };
}
