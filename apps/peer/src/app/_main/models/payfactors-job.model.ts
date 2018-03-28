export interface PayfactorsJob {
  MDJobsBaseId: number;
  JobTitle: string;
  JobFamily: string;
  JobLevel: string;
  JobDescription: string;
  InExchange: boolean;
  PendingRequest: boolean;
}

export function generateMockPayfactorsJob(): PayfactorsJob {
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
