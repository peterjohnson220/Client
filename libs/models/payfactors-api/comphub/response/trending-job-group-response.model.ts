export interface TrendingJobGroupResponse {
  GroupName: string;
  TrendingJobs: TrendingJob[];
}

interface TrendingJob {
  Name: string;
  Count: number;
}
