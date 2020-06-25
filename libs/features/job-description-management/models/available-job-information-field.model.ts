export interface AvailableJobInformationField {
  Id: number;
  DisplayName: string;
  FieldName: string;
  IsDefault: boolean;
  IsRequired: boolean;
  Checked: boolean;
}

export function generateMockAvailableJobInformationField(mockNumber: number = 1, isRequired: boolean = false, isChecked: boolean = false):
  AvailableJobInformationField {
  return {
    Id: mockNumber,
    DisplayName: `Test Display Name ${mockNumber}`,
    FieldName: `Test Field Name ${mockNumber}`,
    IsDefault: false,
    IsRequired: isRequired,
    Checked: isChecked
  };
}
