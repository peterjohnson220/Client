import { GenericMappableField, generateMockGenericMappableField } from './generic-mappable-field.model';

export interface MappingPayloadMapping {
  DestinationField: string;
  SourceField: string;
  SourceMetadata: GenericMappableField;
}

export function generateMockMappingPayloadMapping(): MappingPayloadMapping {
  return {
    DestinationField: 'MockDestinationField',
    SourceField: 'MockSourceField',
    SourceMetadata: generateMockGenericMappableField()
  };
}
