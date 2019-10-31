import { StatusEnum } from 'libs/models/common';

export interface ExchangeJobExchangeDetail {
  ExchangeJobId: number;
  SimilarExchangeJobIds: number[];
  ExchangeJobTitle: string;
  ExchangeJobTitleShort: string;
  ExchangeId: number;
  ExchangeName: string;
  ExchangeStatus: StatusEnum;
}

export function generateMockExchangeJobExchangeDetail(): ExchangeJobExchangeDetail {
  return {
    ExchangeJobId: 0,
    SimilarExchangeJobIds: [],
    ExchangeJobTitle: 'MockExchangeJobTitle',
    ExchangeJobTitleShort: 'MockExchangeJobTitleShort',
    ExchangeId: 0,
    ExchangeName: 'MockExchangeName',
    ExchangeStatus: StatusEnum.Active
  };
}
