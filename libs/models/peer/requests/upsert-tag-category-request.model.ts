export interface UpsertTagCategoryRequest {
  DisplayName: string;
  EntityTypesFlag: number;
  Description: string;
  DataType: string;
  UseSlider: boolean;
}

export function generateMockUpsertTagCategoryRequest(): UpsertTagCategoryRequest {
  return {
    DisplayName: 'Display Name',
    EntityTypesFlag: 3,
    Description: 'Description',
    DataType: 'Text',
    UseSlider: false
  };
}
