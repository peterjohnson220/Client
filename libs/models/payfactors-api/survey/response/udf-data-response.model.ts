export interface UdfDataResponse {
  UdfSettings: UdfSetting[];
  PayElements: PayElement[];
}

export interface UdfSetting {
  SurveyUdfSettingsId: number;
  CompanyId: number;
  PayElementId: number;
  SurveyUdf: string;
  PayElementName: string;
  Value: number;
}

export interface PayElement {
  PayElement_ID: number;
  Name: string;
  IsPercent: number;
}
