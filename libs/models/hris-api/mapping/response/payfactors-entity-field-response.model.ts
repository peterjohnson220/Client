export interface PayfactorsEntityField {
  EntityField_ID: number;
  EntityMappingType_ID: number;
  EntityMappingTypeCode: string;
  FieldName: string;
  DataType_ID: number;
  DataType: string;
}

export interface PayfactorsEntityFieldsResponse {
  PayfactorsEntityFeidls: PayfactorsEntityField[];
}


export function generateMockPayfactorsEntityField(id: number = 0): PayfactorsEntityField {
  return {
    EntityField_ID: id,
    EntityMappingType_ID: id,
    EntityMappingTypeCode: 'MockEntityMappingTypeCode',
    FieldName: 'MockFieldName',
    DataType_ID: id,
    DataType: 'MockDataType'
  };
}

export function generateMockPayfactorsEntityFieldsResponse(): PayfactorsEntityFieldsResponse {
  return {
    PayfactorsEntityFeidls: [
      generateMockPayfactorsEntityField(1),
      generateMockPayfactorsEntityField(2),
      generateMockPayfactorsEntityField(3),
      generateMockPayfactorsEntityField(4),
      generateMockPayfactorsEntityField(5)
    ]
  };
}
