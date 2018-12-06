// DKG  this is the same as companyJob with
// JobSummary instead of description.
// This is one of many possible solutions 
export interface CompanyJobSummary {
    CompanyJobId: number;
    JobCode: string;
    JobTitle: string;
    JobLevel: string;
    JobFamily: string;
    JobSummary: string;
}

export function generateMockCompanyJobSummary(): CompanyJobSummary {
    return {
        CompanyJobId: 1,
        JobTitle: 'MockCompanyJobTitle',
        JobCode: 'MockCompanyJobCode',
        JobLevel: 'MockJobLevel',
        JobFamily: 'MockJobFamily',
        JobSummary: 'MockJobDescription'
    };
}
