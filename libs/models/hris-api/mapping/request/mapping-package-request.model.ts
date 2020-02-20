import { generateMockMappingPayload, MappingPayload } from '../mapping-payload.model';

export interface MappingPackage {
  mappingPayload: MappingPayload;
}

export function generateMockMappingPackageRequest(): MappingPackage {
  return {
    mappingPayload: generateMockMappingPayload()
  };
}
