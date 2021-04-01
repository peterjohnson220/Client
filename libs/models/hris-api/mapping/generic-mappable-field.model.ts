export interface GenericMappableField {
  isArray: boolean;
  dataType: string;
  name: string;
  metadata: any;
}

export function generateMockGenericMappableField(): GenericMappableField {
  return {
    isArray: false,
    dataType: 'Boolean',
    name: 'Mock Generic Field Name',
    metadata: ''
  };
}
