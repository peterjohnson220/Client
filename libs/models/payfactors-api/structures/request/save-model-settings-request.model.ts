export interface SaveModelSettingsRequest {
  RangeGroupId: number;
  StructureName: string;
  ModelName: string;
  ControlPoint: string;
  Rate: string;
  RangeSpreadMin: number;
  RangeSpreadMax: number;
  CurrencyCode: string;
}
