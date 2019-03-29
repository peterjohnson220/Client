import {DataField} from './data-field';
export class DataType {
  Id: number;
  Name: string;
  DataFields: DataField[];
}
export function getMockDataTypes(): DataType[] {
  return [{
    Id: 1,
    Name: 'Test Data type',
    DataFields: [{
      Id: 1,
      Name: 'Test Field',
      DataType: undefined,
      FieldType: 'text'
    }]
  }];
}
