import { GenericMappableField, generateMockGenericMappableField } from './generic-mappable-field.model';

export interface MappingPayloadMapping {
  destinationField: string;
  sourceField: string;
  sourceMetadata: GenericMappableField;
}

export function generateMockMappingPayloadMapping(): MappingPayloadMapping {
  return {
    destinationField: 'MockDestinationField',
    sourceField: 'MockSourceField',
    sourceMetadata: generateMockGenericMappableField()
  };
}
