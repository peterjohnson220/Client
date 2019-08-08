import { SurveyJobDataCutResponse } from './survey-job-data-cut-response.model';

export interface SurveyJobDataResponse {
  SurveyJobId: number;
  DataCuts: SurveyJobDataCutResponse[];
  CurrencyCode?: string;
  TotalResults: number;
}
