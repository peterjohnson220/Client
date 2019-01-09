export interface AddProjectJobsResponse {
  AddedCompanyJobs: AddedProjectJob[];
  AddedPayfactorsJobs: AddedProjectJob[];
  AddedUserJobs: AddedProjectJob[];
  JobExists: boolean;
}

export interface AddedProjectJob {
  Name: string;
  Id: number;
  CompanyJobId: number;
  JobCode: string;
}
