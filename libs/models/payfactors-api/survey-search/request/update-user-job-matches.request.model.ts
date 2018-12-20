import { DataCut } from './add-data-cut-request.model';

export interface UpdateUserJobMatchesRequest {
  ProjectId: number;
  SurveyJobMatchUpdates: SurveyJobMatchUpdate[];
}

export interface SurveyJobMatchUpdate {
  UserJobListTempId: number;
  MatchesToDelete: number[];
  DataCutMatchesToAdd: DataCut[];
}
