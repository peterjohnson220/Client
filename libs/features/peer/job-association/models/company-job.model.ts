export interface CompanyJob {
  CompanyJobId: number;
  JobTitle: string;
  JobCode: string;
  JobDescription: string;
  JobFamily: string;
  IsAssociated: boolean;
  IsPendingPeerUserReview: boolean;
}

export interface CompanyJobWithMatches extends CompanyJob {
  MappedExchangeIds: number[];
}

export function generateMockCompanyJob(): CompanyJob {
  return {
    CompanyJobId: 12,
    JobTitle: 'jobTitle',
    JobCode: 'jobCode',
    JobDescription: 'JobDescription',
    JobFamily: 'JobFamily',
    IsAssociated: true,
    IsPendingPeerUserReview: false,
  };
}

export function generateMockCompanyJobWithMatches(): CompanyJobWithMatches {
  return {
    CompanyJobId: 12,
    JobTitle: 'jobTitle',
    JobCode: 'jobCode',
    JobDescription: 'JobDescription',
    JobFamily: 'JobFamily',
    IsAssociated: true,
    IsPendingPeerUserReview: false,
    MappedExchangeIds: [0, 1]
  };
}
