export interface AvailableJobInformationField {
  Id: number;
  DisplayName: string;
  FieldName: string;
  IsDefault: boolean;
  IsRequired: boolean;
  Checked: boolean;
}

export function generateMockAvailableJobInformationField(): AvailableJobInformationField {
  return {
    Id: 1,
    DisplayName: 'Test Display Name',
    FieldName: 'Test Field Name',
    IsDefault: false,
    IsRequired: false,
    Checked: false
  };
}
