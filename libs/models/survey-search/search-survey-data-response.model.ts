export interface SurveyDataCutResponse {
    SurveyDataId: number;
    Title: string;
    Country: string;
    Weight: string;
    Base50?: number;
    Tcc50?: number;
}

export interface SurveyDataResponse {
  SurveyJobId: number;
  DataCuts: SurveyDataCutResponse[];
  CurrencyCode?: string;
}


