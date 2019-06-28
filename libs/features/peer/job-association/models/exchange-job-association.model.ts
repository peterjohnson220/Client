import { CompanyJob } from './company-job.model';

export interface ExchangeJobAssociation {
    ExchangeId: number;
    ExchangeJobId: number;
    CompanyJobs: CompanyJob[];
}

export function generateMockExchangeJobAssociation(): ExchangeJobAssociation {
  return {
    ExchangeId: 1,
    ExchangeJobId: 123,
    CompanyJobs: [{
      CompanyJobId: 100,
      JobCode: 'jobCode',
      JobFamily: 'jobFamily',
      JobDescription: 'jobDescription',
      JobTitle: 'jobTitle',
      IsAssociated: false,
      IsPendingPeerUserReview: false,
    }]
  };
}
