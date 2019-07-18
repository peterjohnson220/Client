import {
  generateMockJobDescriptionDeleteByTemplateIdRequest,
  JobDescriptionDeleteByTemplateIdRequest
} from './job-description-delete-by-template-id-request.model';

export interface JobDescriptionDeleteByTemplateIdData {
  successFn: any;
  request: JobDescriptionDeleteByTemplateIdRequest;
}

export function generateMockJobDescriptionDeleteByTemplateIdData(): JobDescriptionDeleteByTemplateIdData {
  return {
    successFn: null,
    request: generateMockJobDescriptionDeleteByTemplateIdRequest()
  };
}
