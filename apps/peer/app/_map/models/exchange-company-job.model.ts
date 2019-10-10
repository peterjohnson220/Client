export interface ExchangeCompanyJob {
  ExchangeJobToCompanyJobId: number;
  ExchangeJobId: number;
  CompanyJobId: number;
  CompanyJobCode: string;
  CompanyJobTitle: string;
  CompanyJobFamily: string;
}

export function generateMockExchangeCompanyJob(): ExchangeCompanyJob {
  return {
    ExchangeJobToCompanyJobId: 1,
    ExchangeJobId: 1,
    CompanyJobId: 1,
    CompanyJobCode: 'MockCompanyJobCode',
    CompanyJobTitle: 'MockCompanyJobTitle',
    CompanyJobFamily: 'MockCompanyJobFamily'
  };
}
