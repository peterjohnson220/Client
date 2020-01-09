export interface PayfactorsEntityField {
  entityField_ID: number;
  entityMappingType_ID: number;
  entityMappingTypeCode: string;
  fieldName: string;
  dataType_ID: number;
  dataType: string;
  requiredField: boolean;
  description: string;
  hasDescription: boolean;
}

export interface PayfactorsEntityFieldsResponse {
  payfactorsEntityFields: PayfactorsEntityField[];
}


export function generateMockPayfactorsEntityField(id: number = 0): PayfactorsEntityField {
  return {
    entityField_ID: id,
    entityMappingType_ID: id,
    entityMappingTypeCode: 'MockEntityMappingTypeCode',
    fieldName: 'MockFieldName',
    dataType_ID: id,
    dataType: 'MockDataType',
    requiredField: false,
    description: 'Some Mock Description',
    hasDescription: true
  };
}

export function generateMockPayfactorsEntityFieldsResponse(): PayfactorsEntityFieldsResponse {
  return {
    payfactorsEntityFields: [
      generateMockPayfactorsEntityField(1),
      generateMockPayfactorsEntityField(2),
      generateMockPayfactorsEntityField(3),
      generateMockPayfactorsEntityField(4),
      generateMockPayfactorsEntityField(5)
    ]
  };
}
