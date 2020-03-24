export interface AddStructuresRangeGroupJobsResponse {
  AddedJobs: AddedStructuresRangeGroupJob[];
  JobExists: boolean;
}

export interface AddedStructuresRangeGroupJob {
  Name: string;
  Id: number;
  CompanyJobId: number;
  JobCode: string;
}
