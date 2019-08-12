import { JobDataCut, PeerCut } from './add-data-cut-request.model';

export interface UpdateUserJobMatchesRequest {
  ProjectId: number;
  CompanyPayMarketId: number;
  SurveyJobMatchUpdates: SurveyJobMatchUpdate[];
}

export interface SurveyJobMatchUpdate {
  UserJobListTempId: number;
  MatchesToDelete: number[];
  DataCutMatchesToAdd: JobDataCut[];
  PeerCutMatchesToAdd: PeerCut[];
}
