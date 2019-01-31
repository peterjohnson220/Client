export interface ExchangeJobMapping {
  Id: string;
  ExchangeJobId: number;
  ExchangeId: number;
  CompanyId: number;
  ExchangeJobCode: string;
  ExchangeJobTitle: string;
  ExchangeJobFamily: string;
  ExchangeJobLevel: string;
  ExchangeJobDescription: string;
  ExchangeJobCreateDate: Date;
  Mapped: boolean;
  PendingRequest: boolean;
  MappingCount: number;
  CompanyJobMappings: CompanyJobMapping[];
}

export interface CompanyJobMapping {
  ExchangeJobToCompanyJobId: number;
  CompanyJobId: number;
}

export function generateMockCompanyJobMapping(): CompanyJobMapping {
  return {
    ExchangeJobToCompanyJobId: 345,
    CompanyJobId: 567
  };
}

export function generateMockExchangeJobMapping(): ExchangeJobMapping {
  const exchangeJobId = 28947;
  const companyId = 13;
  return {
    Id: exchangeJobId.toString() + '_' + companyId.toString(),
    ExchangeJobId: exchangeJobId,
    ExchangeId: companyId,
    CompanyId: 13,
    ExchangeJobCode: '1001',
    ExchangeJobTitle: 'Exchange Test Job',
    ExchangeJobFamily: 'Exchange Test Family',
    ExchangeJobLevel: 'II',
    ExchangeJobDescription: 'Lorem Ipsum',
    ExchangeJobCreateDate: new Date(2019, 1, 1),
    Mapped: true,
    PendingRequest: false,
    MappingCount: 1,
    CompanyJobMappings: [generateMockCompanyJobMapping()]
  };
}
