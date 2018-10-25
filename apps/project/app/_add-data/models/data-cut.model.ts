import { DataCut } from 'libs/models/survey-search';
import { JobResult } from './index';

export interface SurveyDataCut {
  SurveyDataId: number;
  Title: string;
  Country: string;
  Weight: string;
  Base50th?: number;
  TCC50th?: number;
  Matches: number;
  IsSelected: boolean;
}

export interface DataCutDetails extends DataCut {
  Job?: JobResult;
  Base50th?: number;
  TCC50th?: number;
}
export function generateMockDataCut(): SurveyDataCut {
  return {
    SurveyDataId: 1,
    Title: 'Metropolitan/Big/Large',
    Country: 'USA',
    Weight: 'Incs (8)',
    Base50th: 50.5,
    TCC50th: 85.5,
    Matches: 4,
    IsSelected: false
  };
}

