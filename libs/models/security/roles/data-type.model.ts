import { DataField } from './data-field.model';

export class DataType {
  Id: number;
  Name: string;
  DataFields: DataField[];
  DataFieldsDropdownDisabled?: boolean;
}
export function getMockDataTypes(): DataType[] {
  return [{
    Id: 1,
    Name: 'Test Data type',
    DataFields: [{
      Id: 1,
      Name: 'Test Field',
      DataType: undefined,
      DataTypeId: 1,
      FieldType: 'text',
      DisplayName: 'Test Field'
    }]
  }];
}
