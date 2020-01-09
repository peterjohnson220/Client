import { generateMockMappingPayload, MappingPayload } from '../mapping-payload.model';

export interface MappingPackage {
  MappingPayload: MappingPayload;
}

export function generateMockMappingPackageRequest(): MappingPackage {
  return {
    MappingPayload: generateMockMappingPayload()
  };
}
