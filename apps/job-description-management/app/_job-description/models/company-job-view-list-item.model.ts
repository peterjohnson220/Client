export class CompanyJobViewListItem {
  CompanyJobId: number;
  JobDescriptionId: number;
  CompanyJobDescriptionTemplateId: number;
  TemplateName: string;
  JobCode: string;
  JobTitle: string;
  VersionNumber: number;
  JobDescriptionStatus: string;
}

export function generateMockCompanyJobViewListItem(): CompanyJobViewListItem {
  return {
    CompanyJobId: 1,
    JobDescriptionId: 1,
    CompanyJobDescriptionTemplateId: 1,
    TemplateName: 'Test Template Name',
    JobCode: 'Test Job Code',
    JobTitle: 'Test Job Title',
    VersionNumber: 1,
    JobDescriptionStatus: 'Test Job Description Status'
  };
}
