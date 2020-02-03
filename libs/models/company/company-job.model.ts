export interface CompanyJob {
    CompanyJobId: number;
    JobCode: string;
    JobTitle: string;
    JobLevel: string;
    JobFamily: string;
    JobDescription: string;
    CompanyJobDescriptionTemplateId: number;
    PublicView: any;
}

export function generateMockCompanyJob(): CompanyJob {
  return {
    CompanyJobId: 1,
    JobTitle: 'MockCompanyJobTitle',
    JobCode: 'MockCompanyJobCode',
    JobLevel: 'MockJobLevel',
    JobFamily: 'MockJobFamily',
    JobDescription: 'MockJobDescription',
    CompanyJobDescriptionTemplateId: 1,
    PublicView: true
  };
}
