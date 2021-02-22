export interface SurveySheetModel {
  Id: number;
  Value: string;
}

export function getSurveySheetInit(): SurveySheetModel[] {
  return [
    {
      Id: 1,
      Value: null
    }
  ];
}
