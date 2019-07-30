export interface AddSurveyDataCutRequest {
  ProjectId: number;
  CompanyJobId: number;
  JobDataCuts: JobDataCut[];
  ExcludeFromParticipation: boolean;
  PayMarketId?: number;
  JobCode: string;
  CompanyPayMarketId?: number;
  PeerDataCuts: PeerCut[];
}

export interface JobDataCut {
  SurveyDataId?: number;
  SurveyJobCode?: string;
  SurveyJobId?: number;
  IsPayfactorsJob: boolean;
  CountryCode?: string;
}

export interface PeerCut {
  ExchangeId: number;
  ExchangeJobId: number;
  DailyNatAvgId: number;
  DailyScopeAvgId: number;
}

export function generateMockPayfactorsCutData(): JobDataCut {
  return {
    SurveyJobCode: 'MD1234',
    IsPayfactorsJob: true,
    CountryCode: 'USA'
  };
}

export function generateMockSurveyJobDataCut(): JobDataCut {
  return {
    SurveyDataId: 1,
    IsPayfactorsJob: false,
    SurveyJobId: 2345
  };
}
