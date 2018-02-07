export interface CompanyJobToMapTo {
  CompanyJobId: number;
  JobCode: string;
  JobTitle: string;
  JobDescription: string;
  Mapped: boolean;
}

export function generateMockCompanyJobToMapTo(): CompanyJobToMapTo {
  return {
    CompanyJobId: 123,
    JobCode: '1001',
    JobTitle: 'MockCompanyJob',
    JobDescription: 'Lorem Ipsum',
    Mapped: false
  };
}
