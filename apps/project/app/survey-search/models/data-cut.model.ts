import { SurveySearchResultDataSources } from 'libs/constants';

import { JobResult } from './';

export interface DataCut {
  Id: number;
  Title: string;
  Country: string;
  Weight: string;
  Base50th?: number;
  TCC50th?: number;
  Incs?: number;
  Orgs?: number;
  Matches: number;
  IsSelected: boolean;
}

export interface DataCutDetails {
  DataCutId?: number;
  DataSource: SurveySearchResultDataSources;
  SurveyJobCode?: string;
  SurveyJobId?: number;
  CountryCode?: string;
  Job?: JobResult;
  Base50th?: number;
  TCC50th?: number;
}

export function generateMockDataCut(): DataCut {
  return {
    Id: 1,
    Title: 'Metropolitan/Big/Large',
    Country: 'USA',
    Weight: 'Incs (8)',
    Base50th: 50.5,
    TCC50th: 85.5,
    Matches: 4,
    IsSelected: false
  };
}

