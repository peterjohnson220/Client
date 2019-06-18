export interface TagCategory {
  TagCategoryId: number;
  FieldName: string;
  DisplayName: string;
  EntityTypesFlag: number;
  Description: string;
  DataType: string;
  UseSlider: boolean;
  CategoryOperator: string;
  DisplayOperatorToggle: boolean;
}

export function generateMockTagCategory(): TagCategory {
  return {
    TagCategoryId: 1,
    FieldName: 'field_name',
    DisplayName: 'Display Name',
    EntityTypesFlag: 0,
    Description: 'description',
    DataType: 'Text',
    UseSlider: false,
    CategoryOperator: 'And',
    DisplayOperatorToggle: false
  };
}
