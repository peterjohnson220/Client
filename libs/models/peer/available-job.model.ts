import {ExchangeStatusEnum} from './exchange-status.enum';

export interface AvailableJob {
  MDJobsBaseId: number;
  ExchangeId: number;
  JobTitle: string;
  JobFamily: string;
  JobLevel: string;
  Status: ExchangeStatusEnum;
}

export function generateMockAvailableJob(): AvailableJob {
  return {
    MDJobsBaseId: 1,
    ExchangeId: 1,
    JobTitle: 'Mock Job',
    JobFamily: 'Mock Family',
    JobLevel: 'Mock Level',
    Status: null
  };
}
