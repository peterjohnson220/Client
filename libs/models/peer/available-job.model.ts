export interface AvailableJob {
  MDJobsBaseId: number;
  ExchangeId: number;
  JobTitle: string;
  JobFamily: string;
  JobLevel: string;
  InExchange: boolean;
}

export function generateMockAvailableJob(): AvailableJob {
  return {
    MDJobsBaseId: 1,
    ExchangeId: 1,
    JobTitle: 'Mock Job',
    JobFamily: 'Mock Family',
    JobLevel: 'Mock Level',
    InExchange: false
  };
}
