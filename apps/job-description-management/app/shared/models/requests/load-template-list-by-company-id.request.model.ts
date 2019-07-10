import { LoadTemplateListRequest } from './load-template-list-request.model';

export interface LoadTemplateListByCompanyIdRequest extends LoadTemplateListRequest {
  companyId: number;
}

export function generateMockLoadTemplateListByCompanyIdRequest(): LoadTemplateListByCompanyIdRequest {
  return {
    companyId: 13,
    publishedOnly: false
  };
}
