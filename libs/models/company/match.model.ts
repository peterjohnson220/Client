export interface Match {
  JobId: number;
  JobTitle: string;
  JobCode: string;
  JobDescription: string;
  JobFamily: string;
  JobLevel: string;
  JobCategory: string;
  PayMarket: string;
  ScopeMapping: string[];
  CompanyJobPricingMatchIds: number[];
  FlsaStatus: string;
  ExcludeFromParticipation: boolean;
  IsPayfactorsJob: boolean;
  Source: string;
  Type: string,
}

export function generateMockMatch(): Match {
  return {
    JobId: 1,
    JobTitle: 'MockJobTitle',
    JobCode: 'MockJobCode',
    JobDescription: 'MockJobDescription',
    JobFamily: 'MockJobFamily',
    JobLevel: 'MockJobLevel',
    JobCategory: 'MockJobCategory',
    PayMarket: 'MockPayMarket',
    ScopeMapping: ['MockScopeMapping1', 'MockScopeMapping2'],
    CompanyJobPricingMatchIds: [1, 2, 3],
    FlsaStatus: 'MockFlsaStatus',
    ExcludeFromParticipation: false,
    IsPayfactorsJob: false,
    Source: 'MockSource',
    Type: 'MockType'
  };
}
