export interface ExchangeJobMapping {
  ExchangeJobId: number;
  ExchangeId: number;
  CompanyId: number;
  ExchangeJobCode: string;
  ExchangeJobTitle: string;
  ExchangeJobFamily: string;
  ExchangeJobLevel: string;
  ExchangeJobDescription: string;
  Mapped: boolean;
  PendingRequest: boolean;
  CompanyJobMappingsCount: number;
  CompanyJobMappings: CompanyJobMapping[];
}

export interface CompanyJobMapping {
  ExchangeJobToCompanyJobId: number;
  CompanyJobCode: string;
  CompanyJobTitle: string;
  CompanyJobLevel: string;
  CompanyJobFamily: string;
  CompanyJobDescription: string;
}
export function generateMockCompanyJobMapping(): CompanyJobMapping {
  return {
    ExchangeJobToCompanyJobId: 345,
    CompanyJobCode: 'A100',
    CompanyJobTitle: 'Company Job Title',
    CompanyJobLevel: 'I',
    CompanyJobFamily: 'Company Job Family',
    CompanyJobDescription: 'Lorem Ipsum'
  };
}
export function generateMockExchangeJobMapping(): ExchangeJobMapping {
  return {
    ExchangeJobId: 28947,
    ExchangeId: 1,
    CompanyId: 13,
    ExchangeJobCode: '1001',
    ExchangeJobTitle: 'Exchange Test Job',
    ExchangeJobFamily: 'Exchange Test Family',
    ExchangeJobLevel: 'II',
    ExchangeJobDescription: 'Lorem Ipsum',
    Mapped: true,
    PendingRequest: false,
    CompanyJobMappingsCount: 1,
    CompanyJobMappings: [generateMockCompanyJobMapping()]
  };
}
