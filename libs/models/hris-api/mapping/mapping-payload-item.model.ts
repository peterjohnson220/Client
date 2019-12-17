import { OrgDataEntityType } from 'libs/constants';

import { MappingPayloadMapping, generateMockMappingPayloadMapping } from './mapping-payload-mapping.model';

export interface MappingPayloadItem {
  OrgDataEntityType: OrgDataEntityType;
  Mappings: MappingPayloadMapping[];
}

export function generateMockMappingPayloadItem(): MappingPayloadItem {
  return {
    OrgDataEntityType: OrgDataEntityType.Employees,
    Mappings: [
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
