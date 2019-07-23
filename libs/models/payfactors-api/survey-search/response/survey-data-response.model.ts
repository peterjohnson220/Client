import { DataCutResponse } from './data-cut-response.model';

export interface SurveyDataResponse {
  SurveyJobId: number;
  DataCuts: DataCutResponse[];
  CurrencyCode?: string;
  TotalResults: number;
}


