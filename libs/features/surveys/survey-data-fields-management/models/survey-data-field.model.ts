export interface SurveyDataField {
  Group: string;
  EntitySourceName: string;
  SourceName: string;
  DisplayName: string;
  GroupOrder: number;
  IsSelected: boolean;
  Order: number;
}

export interface SurveyDataFieldGroup {
  GroupName: string;
  Fields: SurveyDataField[];
  HasSelectedField: boolean;
}
