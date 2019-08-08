import { DataCutResponse } from './data-cut-response.model';

export interface SurveyJobDataCutResponse extends DataCutResponse {
  SurveyDataId: number;
  Matches: number;
}
