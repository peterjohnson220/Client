export interface SurveyDataCut {
  SurveyDataId: number;
  Title: string;
  Country: string;
  Weight: string;
  Base50th?: number;
  TCC50th?: number;
  Match: number;
  IsSelected: boolean;
}

export function generateMockDataCut(): SurveyDataCut {
  return {
    SurveyDataId: 1,
    Title: 'Metropolitan/Big/Large',
    Country: 'USA',
    Weight: 'Incs (8)',
    Base50th: 50.5,
    TCC50th: 85.5,
    Match: 4,
    IsSelected: false
  };
}
