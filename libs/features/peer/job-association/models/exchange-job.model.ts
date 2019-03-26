import { CompanyJobMapping } from 'libs/models/peer';

export interface ExchangeJob {
  ExchangeJobId: number;
  ExchangeJobTitle: string;
  ExchangeJobDescription: string;
  ExchangeJobFamily: string;
  ExchangeId: number;
  ExchangeName: string;
  CompanyJobMappings: CompanyJobMapping[];
}
