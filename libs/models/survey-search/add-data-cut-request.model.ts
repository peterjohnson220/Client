export interface AddSurveyDataCutRequest {
  ProjectId: number;
  CompanyJobId: number;
  JobDataCuts: DataCut[];
  ExcludeFromParticipation: boolean;
  PayMarketId?: number;
  JobCode: string;
}

export interface DataCut {
  DataCutId?: number;
  SurveyJobCode?: string;
  SurveyJobId?: number;
  IsPayfactorsJob: boolean;
  CountryCode?: string;
}

export function generateMockPayfactorsCutData(): DataCut {
  return {
    SurveyJobCode: 'MD1234',
    IsPayfactorsJob: true,
    CountryCode: 'USA'
  };
}

export function generateMockSurveyJobDataCut(): DataCut {
  return {
    DataCutId: 1,
    IsPayfactorsJob: false,
    SurveyJobId: 2345
  };
}
