export interface JobMatchCutsResponse {
  JobMatchCuts: JobMatchCut[];
}

export interface JobMatchCut {
  UserJobMatchId?: number;
  Source: string;
  Base50?: number;
  TCC50?: number;
  JobTitle: string;
  JobCode: string;
  DataCutId?: number;
  SurveyJobCode?: string;
  PeerCutId?: string;
  CutFilterId?: string;
  MatchWeight: number;
  MatchAdjustment: number;
  Incs: number;
  Orgs: number;
  WeightingType: string;
}

export function generateMockJobMatchCut(): JobMatchCut {
  return {
    UserJobMatchId: 1,
    Source: 'Payfactors',
    Base50: 25.66,
    TCC50: 100.11,
    JobCode: 'JB122',
    JobTitle: 'Janitor/Custodian',
    SurveyJobCode: 'KKNN',
    DataCutId: 12345,
    MatchWeight: 0,
    MatchAdjustment: 0,
    Incs: 0,
    Orgs: 0,
    WeightingType: 'I'
  };
}
