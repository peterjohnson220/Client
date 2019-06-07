import { generateMockTag, Tag } from '../tag.model';
import { TagInformationRequest, generateMockTagInformationRequest } from './tag-information-request.model';

export interface SaveTagInformationRequest extends TagInformationRequest {
  AddedTags: Tag[];
  RemovedTags: Tag[];
}

export function generateMockSaveTagInformationRequest(): SaveTagInformationRequest {
  return {
    ...generateMockTagInformationRequest(),
    AddedTags: [ generateMockTag() ],
    RemovedTags: [ generateMockTag() ]
  };
}
