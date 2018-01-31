export interface ExchangeJobMapping {
  ExchangeJobId: number;
  ExchangeId: number;
  CompanyId: number;
  ExchangeJobCode: string;
  ExchangeJobTitle: string;
  CompanyJobCode: string;
  CompanyJobTitle: string;
  CompanyJobLevel: string;
  ExchangeJobFamily: string;
  ExchangeJobLevel: string;
  CompanyJobFamily: string;
  CompanyJobDescription: string;
  ExchangeJobDescription: string;
  Mapped: boolean;
}

export function generateMockExchangeJobMapping(): ExchangeJobMapping {
  return {
    ExchangeJobId: 28947,
    ExchangeId: 1,
    CompanyId: 13,
    ExchangeJobCode: '1001',
    ExchangeJobTitle: 'Exchange Test Job',
    CompanyJobCode: 'A100',
    CompanyJobTitle: 'Company Job Title',
    CompanyJobLevel: 'I',
    ExchangeJobFamily: 'Exchange Test Family',
    ExchangeJobLevel: 'II',
    CompanyJobFamily: 'Company Job Family',
    CompanyJobDescription: 'Lorem Ipsum',
    ExchangeJobDescription: 'Lorem Ipsum',
    Mapped: true
  };
}
