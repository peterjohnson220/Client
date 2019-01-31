export interface Job {
  JobId?: number;
  JobType?: string;
  JobCode: string;
  JobTitle: string;
  JobFamily: string;
  JobLevel: string;
  JobDescription: string;
}

export function generateMockJob(): Job {
  return {
    JobId: 123,
    JobType: 'Company',
    JobCode: '1002',
    JobTitle: 'Mock Job',
    JobFamily: 'Mock Family',
    JobLevel: 'Mock Level',
    JobDescription: 'Lorem Ipsum'
  };
}

export interface LatestCompanyJob extends Job {
  CompanyJobId: number;
  MappedExchangeIds: number[];
}

export function generateMockLatestCompanyJob(): LatestCompanyJob {
  return {
    ...generateMockJob(),
    CompanyJobId: 2,
    MappedExchangeIds: [2, 3]
  };
}
