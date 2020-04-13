import { JobData, generateFakeJobData } from './job-data.model';

export interface PeerQuickPriceData {
  JobData: JobData;
}

export function generateMockPeerQuickPriceData(): PeerQuickPriceData {
  return {
    JobData: generateFakeJobData()
  };
}
