export interface Match {
  JobId: number;
  JobTitle: string;
  JobCode: string;
  JobDescription: string;
  JobFamily: string;
  JobLevel: string;
  JobCategory: string;
  SurveyName: string;
  SurveyPublisher: string;
  EffectiveDate: string;
  PayMarket: string;
  ScopeMapping: string[];
  CompanyJobPricingMatchIds: number[];
  FlsaStatus: string;
  ExcludeFromParticipation: boolean;
  IsPayfactorsJob: boolean;
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
    SurveyName: 'MockSurveyName',
    SurveyPublisher: 'MockSurveyPublisher',
    EffectiveDate: '2018-01-01',
    PayMarket: 'MockPayMarket',
    ScopeMapping: ['MockScopeMapping1', 'MockScopeMapping2'],
    CompanyJobPricingMatchIds: [1, 2, 3],
    FlsaStatus: 'MockFlsaStatus',
    ExcludeFromParticipation: false,
    IsPayfactorsJob: false
  };
}
