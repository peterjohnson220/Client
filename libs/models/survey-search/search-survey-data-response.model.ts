export interface SurveyDataCut {
    SurveyDataId: number;
    Title: string;
    Country: string;
    Weight: string;
    Base50?: number;
    Tcc50?: number;
}

export interface SurveyDataCutResponse {
  SurveyJobId: number;
  DataCuts: SurveyDataCut[];
  CurrencyCode?: string;
}


