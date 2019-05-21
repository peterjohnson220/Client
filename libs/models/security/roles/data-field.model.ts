import {DataType} from './data-type.model';

export class DataField {
  Id: number;
  Name: string;
  FieldType: string;
  DataTypeId: number;
  DataType: DataType;
  DisplayName: string;
}
