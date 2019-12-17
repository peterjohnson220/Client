import { generateMockMappingPayloadItem, MappingPayloadItem } from './mapping-payload-item.model';

export interface MappingPayload {
  Items: MappingPayloadItem[];
}

export function generateMockMappingPayload(): MappingPayload {
  return {
    Items: [
      generateMockMappingPayloadItem(),
    ]
  };
}
