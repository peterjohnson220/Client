export interface JobDescriptionDeleteByTemplateIdRequest {
  companyId: number;
  templateId: number;

}

export function generateMockJobDescriptionDeleteByTemplateIdRequest(): JobDescriptionDeleteByTemplateIdRequest {
  return {
    companyId: 13,
    templateId: 0
  };
}
