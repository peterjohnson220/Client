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
}
