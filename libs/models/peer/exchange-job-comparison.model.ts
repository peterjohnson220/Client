export interface ExchangeJobComparison {
  ExchangeJobToCompanyJobId: number;
  ExchangeJobId: number;
  CompanyJobTitle: string;
  ExchangeJobTitle: string;
  ExchangeJobFamily: string;
  ExchangeIncs: number;
  ExchangeOrgs: number;
  ExchangeBaseAverage: number;
  CompanyBaseAverage: number;
  ExchangeIndex: number;
}

export function generateMockExchangeJobComparison(): ExchangeJobComparison {
  return {
    ExchangeJobToCompanyJobId: 1,
    ExchangeJobId: 1,
    CompanyJobTitle: 'MockCompanyJob',
    ExchangeJobTitle: 'MockExchangeJob',
    ExchangeJobFamily: 'MockExchangeJobFamily',
    ExchangeIncs: 1,
    ExchangeOrgs: 1,
    ExchangeBaseAverage: 0.1,
    CompanyBaseAverage: 0.1,
    ExchangeIndex: 100.00
  };
}
