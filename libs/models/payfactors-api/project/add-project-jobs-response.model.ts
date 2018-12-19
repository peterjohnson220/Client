export interface AddProjectJobsResponse {
  AddedCompanyJobs: AddedProjectJob[];
  AddedPayfactorsJobs: AddedProjectJob[];
}

export interface AddedProjectJob {
  Name: string;
  Id: number;
  CompanyJobId: number;
  PayfactorsJobCode: string;
}
