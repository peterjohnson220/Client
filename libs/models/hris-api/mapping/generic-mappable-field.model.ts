import { ImportDataType } from 'libs/constants';

export interface GenericMappableField {
  IsArray: boolean;
  DataType: ImportDataType;
  Name: string;
  MetaData: any;
}

export function generateMockGenericMappableField(): GenericMappableField {
  return {
    IsArray: false,
    DataType: ImportDataType.String,
    Name: 'Mock Generic Field Name',
    MetaData: ''
  };
}
