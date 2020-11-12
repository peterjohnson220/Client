import { SurveySearchResultDataSources } from 'libs/constants';

import { JobResult } from './';

export interface DataCut {
  Id: string;
  Title: string;
  Country: string;
  Weight: string;
  Base50th?: number;
  TCC50th?: number;
  Incs?: number;
  Orgs?: number;
  Matches: number;
  IsSelected: boolean;
  ServerInfo: ServerInfo;
}

export interface DataCutDetails {
  DataSource: SurveySearchResultDataSources;
  SurveyJobCode?: string;
  SurveyJobId?: number;
  CountryCode?: string;
  Job?: JobResult;
  Base50th?: number;
  TCC50th?: number;
  ServerInfo?: ServerInfo;
  CutFilterId?: string;
  Incs: number;
  Orgs: number;
  WeightingType: string;
}

interface ServerInfo {
  DailyNatAvgId?: number;
  DailyScopeAvgId?: number;
  SurveyDataId?: number;
}

export function generateMockDataCut(): DataCut {
  return {
    Id: '23094203480',
    Title: 'Metropolitan/Big/Large',
    Country: 'USA',
    Weight: 'Incs (8)',
    Base50th: 50.5,
    TCC50th: 85.5,
    Matches: 4,
    IsSelected: false,
    ServerInfo: {
      SurveyDataId: 1
    }
  };
}

