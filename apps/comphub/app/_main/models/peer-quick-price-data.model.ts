import { JobData, generateFakeJobData } from './job-data.model';

export interface PeerQuickPriceData {
  JobData: JobData;
  PayHistoryDictionary: any;
  PayHistoryCollection: PayRateDate[];
}

export interface PayRateDate {
  EffectiveDate: Date;
  BasePay: number;
}

export function generateMockPeerQuickPriceData(): PeerQuickPriceData {
  return {
    JobData: generateFakeJobData(),
    PayHistoryDictionary: null,
    PayHistoryCollection: null
  };
}
