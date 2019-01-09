export interface CreateNewProjectJobRequest {
  JobCode: string;
  JobTitle: string;
  JobLevel: string;
  JobFamily: string;
  JobDescription: string;
  CompanyPayMarketIds: number[];
}
