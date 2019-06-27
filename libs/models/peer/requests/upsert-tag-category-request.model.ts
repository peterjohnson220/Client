export interface UpsertTagCategoryRequest {
  DisplayName: string;
  EntityTypesFlag: number;
  Description: string;
  DataType: string;
  UseSlider: boolean;
  CategoryOperator: string;
  DisplayOperatorToggle: boolean;
}

export function generateMockUpsertTagCategoryRequest(): UpsertTagCategoryRequest {
  return {
    DisplayName: 'Display Name',
    EntityTypesFlag: 3,
    Description: 'Description',
    DataType: 'Text',
    UseSlider: false,
    CategoryOperator: 'And',
    DisplayOperatorToggle: false
  };
}
