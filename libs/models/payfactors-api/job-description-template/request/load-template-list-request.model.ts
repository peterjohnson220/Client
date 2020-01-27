export interface LoadTemplateListRequest {
  publishedOnly: boolean;
}

export function generateMockLoadTemplateListRequest(): LoadTemplateListRequest {
  return {
    publishedOnly: false
  };
}
