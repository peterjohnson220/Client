import { OrgDataEntityType } from 'libs/constants';

import { MappingPayloadMapping, generateMockMappingPayloadMapping } from './mapping-payload-mapping.model';

export interface MappingPayloadItem {
  orgDataEntityType: string;
  mappings: MappingPayloadMapping[];
}

export function generateMockMappingPayloadItem(): MappingPayloadItem {
  return {
    orgDataEntityType: OrgDataEntityType.Employees,
    mappings: [
      generateMockMappingPayloadMapping(),
      generateMockMappingPayloadMapping(),
      generateMockMappingPayloadMapping(),
      generateMockMappingPayloadMapping(),
      generateMockMappingPayloadMapping(),
      generateMockMappingPayloadMapping(),
      generateMockMappingPayloadMapping(),
    ]
  };
}
