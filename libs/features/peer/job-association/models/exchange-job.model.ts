import { CompanyJobMapping } from 'libs/models/peer';

export interface ExchangeJob {
  Id: string;
  ExchangeJobId: number;
  ExchangeJobTitle: string;
  ExchangeJobDescription: string;
  ExchangeJobFamily: string;
  ExchangeId: number;
  ExchangeName: string;
  CompanyJobMappings: CompanyJobMapping[];
}

export function generateMockExchangeJob(): ExchangeJob {
  return {
    Id: '123',
    ExchangeJobId: 456,
    ExchangeJobTitle: 'ExchangeJobTitle',
    ExchangeJobDescription: 'ExchangeJobDescription',
    ExchangeJobFamily: 'ExchangeJobFamily',
    ExchangeId: 789,
    ExchangeName: 'ExchangeName',
    CompanyJobMappings: [],
  };
}
