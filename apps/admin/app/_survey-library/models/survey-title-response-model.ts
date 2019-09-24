export interface SurveyTitleResponseModel {
  PublisherName: string;
  PublisherTitles: SurveyTitle[];
}

export interface SurveyTitle {
  SurveyTitleId: number;
  SurveyName: string;
}

export interface SurveyTitleCompanyModel {
  CompanyId: number;
  CompanyName: string;
  SurveyYearId: number;
  SurveyYear: number;
  CustomSurveyName: string;
}
