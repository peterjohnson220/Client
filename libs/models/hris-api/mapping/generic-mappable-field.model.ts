import { ImportDataType } from 'libs/constants';

export interface GenericMappableField {
  isArray: boolean;
  dataType: ImportDataType;
  name: string;
  metaData: any;
}

export function generateMockGenericMappableField(): GenericMappableField {
  return {
    isArray: false,
    dataType: ImportDataType.String,
    name: 'Mock Generic Field Name',
    metaData: ''
  };
}
