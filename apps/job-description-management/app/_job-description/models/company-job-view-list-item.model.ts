export class CompanyJobViewListItem {
  CompanyJobId: number;
  JobDescriptionId: number;
  CompanyJobDescriptionTemplateId: number;
  TemplateName: string;
  JobCode: string;
  JobTitle: string;
  VersionNumber: number;
  JobDescriptionStatus: string;
  PublicView: boolean;
}

export function generateMockCompanyJobViewListItem(mockNumber: number = 1): CompanyJobViewListItem {
  return {
    CompanyJobId: mockNumber,
    JobDescriptionId: mockNumber + 1,
    CompanyJobDescriptionTemplateId: mockNumber,
    TemplateName: `Test Template Name ${mockNumber}`,
    JobCode: `Test Job Code ${mockNumber}`,
    JobTitle: `Test Job Title ${mockNumber}`,
    VersionNumber: 1,
    JobDescriptionStatus: `Test Job Description Status ${mockNumber}`,
    PublicView: true
  };
}
