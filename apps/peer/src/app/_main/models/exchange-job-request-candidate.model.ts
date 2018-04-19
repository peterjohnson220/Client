export interface ExchangeJobRequestCandidate {
  MDJobsBaseId: number;
  JobTitle: string;
  JobFamily: string;
  JobLevel: string;
  JobDescription: string;
  InExchange: boolean;
  PendingRequest: boolean;
}

export function generateMockExchangeJobRequestCandidate(): ExchangeJobRequestCandidate {
  return {
    MDJobsBaseId: 0,
    JobTitle: 'MockJobTitle',
    JobFamily: 'MockJobFamily',
    JobLevel: 'MockJobLevel',
    JobDescription: 'MockJobDescription',
    InExchange: false,
    PendingRequest: false
  };
}
