import { generateMockMappingPayloadItem, MappingPayloadItem } from './mapping-payload-item.model';

export interface MappingPayload {
  items: MappingPayloadItem[];
}

export function generateMockMappingPayload(): MappingPayload {
  return {
    items: [
      generateMockMappingPayloadItem(),
    ]
  };
}
