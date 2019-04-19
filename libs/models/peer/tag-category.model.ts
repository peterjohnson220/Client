export interface TagCategory {
  TagCategoryId: number;
  FieldName: string;
  DisplayName: string;
  EntityTypesFlag: number;
  Description: string;
}

export function generateMockTagCategory(): TagCategory {
  return {
    TagCategoryId: 1,
    FieldName: 'field_name',
    DisplayName: 'Display Name',
    EntityTypesFlag: 0,
    Description: 'description'
  };
}
