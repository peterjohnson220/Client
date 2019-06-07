import { TagEntityTypeEnum } from '../tag-entity-type.enum';

export interface TagInformationRequest {
  EntityId: number;
  EntityType: string;
}

export function generateMockTagInformationRequest(): TagInformationRequest {
  return {
    EntityId: 1,
    EntityType: TagEntityTypeEnum.Company
  };
}
