export interface CompanyIndustriesResponse {
  Group: string;
  Industry: string;
}

export function generateMockCompanyIndustriesResponse(): CompanyIndustriesResponse {
  return {
    Group: 'MockGroup',
    Industry: 'MockIndustry'
  };
}
